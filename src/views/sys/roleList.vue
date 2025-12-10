<template>
    <div class="role-permission-page">
        <!-- Header Section -->
        <div class="page-header">
            <div class="header-left">
                <el-select v-model="param.status" placeholder="状态" clearable style="width: 120px; margin-right: 10px;">
                    <el-option label="全部" value="" />
                    <el-option label="启用" value="1" />
                    <el-option label="禁用" value="0" />
                </el-select>
                <el-button v-blur type="primary" icon="Search" @click="Query">查询</el-button>
                <el-button v-blur type="success" icon="Plus" @click="edit.Open(null)">新增</el-button>
            </div>
            <div class="header-center" v-if="currentRole">
                <span class="current-role-label">当前角色: <strong>{{ currentRole.role }}</strong></span>
            </div>
            <div class="header-right" v-if="currentRole">
                <el-button v-blur type="warning" icon="Sort" @click="expandAll">全部展开</el-button>
                <el-button v-blur type="warning" icon="Sort" @click="collapseAll">全部收起</el-button>
                <el-button v-blur type="success" icon="Check" @click="savePermissions">保存</el-button>
            </div>
        </div>

        <!-- Main Content: Split Layout -->
        <div class="page-content">
            <!-- Left Panel: Role List -->
            <div class="role-panel">
                <el-scrollbar height="100%">
                    <div class="role-list">
                        <div 
                            v-for="item in tableData" 
                            :key="item.id"
                            class="role-item"
                            :class="{ active: currentRole?.id === item.id }"
                            @click="selectRole(item)"
                        >
                            <div class="role-content">
                                <span class="role-name">{{ item.role }}</span>
                                <span class="role-id">(ID: {{ item.id }})</span>
                                <span class="role-count">{{ item.users_count || 0 }}人</span>
                                <div class="role-actions">
                                    <el-button link type="primary" size="small" @click.stop="edit.Open(item)">修改</el-button>
                                    <el-popconfirm title="确定删除?" @confirm="Delete(item.id)">
                                        <template #reference>
                                            <el-button link type="danger" size="small" @click.stop>删除</el-button>
                                        </template>
                                    </el-popconfirm>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-scrollbar>
            </div>

            <!-- Right Panel: Permissions Tree -->
            <div class="permission-panel">
                <el-scrollbar height="100%">
                    <div v-if="currentRole" class="permission-content">
                        <el-tree
                            ref="permissionTree"
                            :key="'tree-' + currentRole.id + '-' + Date.now()"
                            :data="roleTree"
                            show-checkbox
                            node-key="id"
                            default-expand-all
                            :expand-on-click-node="true"
                            :props="{ label: 'name', children: 'childs', class: customNodeClass }"
                            :default-checked-keys="checkedKeys"
                            @check="handleCheck"
                            class="permission-tree"
                            v-if="roleTree && roleTree.length > 0"
                        >
                            <template #default="{ node, data }">
                                <span class="tree-node">
                                    <span class="node-label">{{ data.name }}</span>
                                    <span v-if="hasChildren(data)" class="node-count">
                                        ({{ getCheckedCount(data) }}/{{ getTotalChildren(data) }})
                                    </span>
                                </span>
                            </template>
                        </el-tree>
                    </div>
                    <div v-else class="empty-state">
                        <el-empty description="请从左侧选择一个角色查看权限" />
                    </div>
                </el-scrollbar>
            </div>
        </div>
    </div>
    <Edit1 ref="edit" @query="Query"></Edit1>
</template>

<script setup>
    import { nextTick } from 'vue'
    import Edit1 from './roleEdit.vue';
    const edit = ref(null)
    const permissionTree = ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({});
    const tableData = ref([])
    const currentRole = ref(null)
    const roleTree = ref([])
    const checkedKeys = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中')
        axios.post('/admin/roles/list', param.value).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.roles;
                // Auto-select first role if available
                if (tableData.value.length > 0 && !currentRole.value) {
                    selectRole(tableData.value[0])
                }
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
    
    //选择角色
    function selectRole(role){
        currentRole.value = role
        loadRolePermissions(role.id)
    }
    
    //加载角色权限
    function loadRolePermissions(roleId){
        let loading = tips.loading('加载权限中')
        axios.post('/admin/links/list', { role: roleId }).then( res => {
            if (res.status == 200) {
                // Ensure data structure is correct - transform if needed
                const normalizedData = normalizeTreeData(res.data);
                roleTree.value = normalizedData;
                
                // Extract checked keys from tree data (API may include checked status in nodes)
                checkedKeys.value = extractCheckedKeys(normalizedData)
                
                // Force tree to re-render and expand all nodes
                nextTick(() => {
                    if (permissionTree.value) {
                        // Set checked keys if we found any
                        if (checkedKeys.value.length > 0) {
                            permissionTree.value.setCheckedKeys(checkedKeys.value, false)
                        }
                        
                        // Force expand all nodes - use multiple attempts to ensure all are expanded
                        setTimeout(() => {
                            expandAllNodes()
                        }, 50)
                        
                        setTimeout(() => {
                            expandAllNodes()
                        }, 200)
                    }
                })
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
    
    //规范化树数据，确保所有子节点都正确显示
    function normalizeTreeData(data){
        if (!data || !Array.isArray(data)) return []
        return data.map(item => {
            const normalized = { ...item }
            // Ensure childs array exists and is properly structured - recursively process all levels
            if (item.childs && Array.isArray(item.childs) && item.childs.length > 0) {
                // Recursively normalize all nested children
                normalized.childs = normalizeTreeData(item.childs)
            } else if (item.children && Array.isArray(item.children) && item.children.length > 0) {
                // Handle both 'childs' and 'children' property names
                normalized.childs = normalizeTreeData(item.children)
            } else {
                // Explicitly set empty array if no children
                normalized.childs = item.childs || item.children || []
            }
            return normalized
        })
    }
    
    //从树结构提取已选中的keys
    function extractCheckedKeys(treeData){
        const keys = []
        function traverse(nodes){
            if (!nodes || !Array.isArray(nodes)) return
            nodes.forEach(node => {
                // Check if node has checked property (API may return this)
                if (node.checked === true || node.selected === true || node.is_checked === true || node.checked === 1) {
                    keys.push(node.id)
                }
                // Traverse children recursively to get all checked nodes
                if (node.childs && node.childs.length > 0) {
                    traverse(node.childs)
                }
            })
        }
        traverse(treeData)
        return keys
    }
    
    //获取节点样式类 (匹配原始modal样式)
    function customNodeClass(data){
        if(data.level == 2) return 'is-penultimate'
        else return ''
    }
    
    //检查是否有子节点
    function hasChildren(data){
        return (data.childs && data.childs.length > 0) || (data.children && data.children.length > 0)
    }
    
    //获取子节点总数
    function getTotalChildren(data){
        const children = data.childs || data.children || []
        return children.length
    }
    
    //获取已选中的数量
    function getCheckedCount(node){
        const children = node.childs || node.children || []
        if (children.length === 0) return 0
        if (!permissionTree.value) {
            // Fallback: count from checkedKeys
            return children.filter(child => checkedKeys.value.includes(child.id)).length
        }
        const checked = permissionTree.value.getCheckedKeys()
        return children.filter(child => checked.includes(child.id)).length
    }
    
    //处理复选框变化
    function handleCheck(data, checked){
        // Update checked keys
        if (permissionTree.value) {
            checkedKeys.value = permissionTree.value.getCheckedKeys()
        }
    }
    
    //展开所有节点（内部函数）
    function expandAllNodes(){
        if (permissionTree.value && permissionTree.value.store) {
            const allKeys = getAllKeys(roleTree.value)
            allKeys.forEach(key => {
                const node = permissionTree.value.store.nodesMap[key]
                if (node) {
                    node.expanded = true
                }
            })
        }
    }
    
    //展开全部
    function expandAll(){
        nextTick(() => {
            expandAllNodes()
        })
    }
    
    //收起全部
    function collapseAll(){
        nextTick(() => {
            if (permissionTree.value && permissionTree.value.store) {
                const allKeys = getAllKeys(roleTree.value)
                allKeys.forEach(key => {
                    const node = permissionTree.value.store.nodesMap[key]
                    if (node) {
                        node.expanded = false
                    }
                })
            }
        })
    }
    
    //获取所有keys
    function getAllKeys(treeData){
        const keys = []
        function traverse(nodes){
            nodes.forEach(node => {
                keys.push(node.id)
                if (node.childs && node.childs.length > 0) {
                    traverse(node.childs)
                }
            })
        }
        traverse(treeData)
        return keys
    }
    
    //保存权限
    function savePermissions(){
        if (!currentRole.value) {
            tips.error('请先选择角色')
            return
        }
        if (!permissionTree.value) {
            tips.error('权限树未加载')
            return
        }
        const linkIds = permissionTree.value.getCheckedKeys()
        let loading = tips.loading('保存中')
        axios.post('/admin/roles/savePermissions', {
            role: currentRole.value.id,
            link_ids: linkIds
        }).then( res => {
            if (res.status == 200) {
                tips.success('保存成功')
                loadRolePermissions(currentRole.value.id)
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
    
    //删除
    function Delete(id){
        let loading = tips.loading('删除中')
        axios.post('/admin/roles/delete', {role: id}).then( res => {
            if (res.status == 200) {
                tips.success('删除成功')
                if (currentRole.value?.id === id) {
                    currentRole.value = null
                    roleTree.value = []
                }
                Query()
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }

</script>

<style scoped>
.role-permission-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

/* Header Section */
.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    background-color: #fafafa;
}

.header-left {
    display: flex;
    align-items: center;
}

.header-center {
    flex: 1;
    text-align: center;
}

.current-role-label {
    font-size: 16px;
    color: #606266;
}

.current-role-label strong {
    color: #409eff;
    font-size: 18px;
}

.header-right {
    display: flex;
    gap: 10px;
}

/* Main Content: Split Layout */
.page-content {
    flex: 1;
    display: flex;
    height: calc(100vh - 180px);
    overflow: hidden;
}

/* Left Panel: Role List */
.role-panel {
    width: 300px;
    border-right: 1px solid #eee;
    background-color: #fafafa;
}

.role-list {
    padding: 15px;
}

.role-item {
    padding: 15px;
    margin-bottom: 10px;
    background-color: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.role-item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.role-item.active {
    border-color: #409eff;
    background-color: #ecf5ff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.role-content {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    flex-wrap: nowrap;
}

.role-name {
    font-size: 14px;
    font-weight: normal;
    color: #409eff;
    white-space: nowrap;
}

.role-id {
    font-size: 12px;
    color: #82868b;
    white-space: nowrap;
}

.role-count {
    font-size: 12px;
    color: #82868b;
    white-space: nowrap;
}

.role-actions {
    display: flex;
    gap: 8px;
    margin-left: auto;
    white-space: nowrap;
}

/* Right Panel: Permissions Tree */
.permission-panel {
    flex: 1;
    background-color: #fff;
    padding: 20px;
}

.permission-content {
    height: 100%;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.permission-tree {
    font-size: 14px;
}

:deep(.permission-tree .el-tree-node__content) {
    height: 36px;
    line-height: 36px;
    padding: 0 8px;
    border-radius: 4px;
    margin-bottom: 4px;
    transition: background-color 0.2s;
}

:deep(.permission-tree .el-tree-node__content:hover) {
    background-color: #f5f7fa;
}

:deep(.permission-tree .el-tree-node__label) {
    font-size: 14px;
}

.tree-node {
    display: flex;
    align-items: center;
    width: 100%;
}

.node-label {
    flex: 1;
    color: #303133;
}

.node-count {
    margin-left: 10px;
    color: #909399;
    font-size: 12px;
    font-weight: 500;
}

/* Tree styling - matching original modal */
:deep(.permission-tree .el-tree-node) {
    margin-bottom: 2px;
}

/* Level 2 nodes - horizontal layout (matching original is-penultimate style) */
:deep(.permission-tree .is-penultimate > .el-tree-node__content) {
    color: #626aef;
    font-weight: 500;
}

:deep(.permission-tree .el-tree .el-tree-node .is-penultimate > .el-tree-node__children) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}

:deep(.permission-tree .is-penultimate > .el-tree-node__children > .el-tree-node) {
    margin-bottom: 5px;
    margin-right: 10px;
}

/* Ensure all nodes are visible */
:deep(.permission-tree .el-tree-node__content) {
    height: auto;
    min-height: 32px;
    padding: 4px 8px;
}

:deep(.permission-tree .el-tree-node__label) {
    white-space: normal;
    word-break: break-word;
}

:deep(.permission-tree .el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: #409eff;
    border-color: #409eff;
}

:deep(.permission-tree .el-checkbox__input.is-indeterminate .el-checkbox__inner) {
    background-color: #409eff;
    border-color: #409eff;
}
</style>