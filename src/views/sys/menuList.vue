<template>
    <div class="page-t">
        <el-scrollbar class="page-param" max-height="126px" style="margin-bottom: 5px;">
            <el-form :inline="true">
                <el-form-item label="菜单名称">
                    <el-input  v-model="param.name" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="层级">
                    <el-select v-model="param.level" placeholder="请选择" clearable>
                        <el-option label="一级菜单" :value="1" />
                        <el-option label="二级菜单" :value="2" />
                        <el-option label="页面按钮" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="param.status" placeholder="请选择" clearable>
                        <el-option label="开启" :value="1" />
                        <el-option label="关闭" :value="0" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <el-scrollbar style="white-space: nowrap; margin-bottom: 10px;">
            <el-button v-blur type="primary" icon="Search" @click="Query">  查询</el-button>
            <el-button v-blur type="warning" icon="RefreshLeft" @click="Reset">  重置</el-button>
            <el-button v-blur type="success" icon="Plus" @click="edit.Open(null)">添加</el-button>
            <!-- <el-button v-blur type="danger" icon="Delete"  @click="funDeletes">删除</el-button>
            <el-button v-blur type="info" icon="Download">导出</el-button> -->
        </el-scrollbar>

        <el-table 
            :data="tableData" 
            row-key="id" 
            :tree-props="{ children: 'childs' }"
            default-expand-all
            @selection-change="SelectionChange" 
            border 
            max-height="calc(100vh - 250px)"
            class="menu-table"
        >
            <el-table-column fixed type="selection" width="38" />
            <el-table-column prop="name" label="菜单名称" min-width="200" show-overflow-tooltip tree-node>
                <template #default="scope">
                    <div class="menu-name-cell">
                        <el-icon v-if="scope.row.level == 1" class="menu-icon folder-icon">
                            <Folder />
                        </el-icon>
                        <el-icon v-else class="menu-icon file-icon">
                            <Document />
                        </el-icon>
                        <span>{{ scope.row.name }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="path" label="URL" min-width="250" show-overflow-tooltip>
                <template #default="scope">
                    <span class="url-text">{{ scope.row.path || '/' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="path" label="路由" min-width="150" show-overflow-tooltip>
                <template #default="scope">
                    <span class="route-text">{{ getRouteName(scope.row) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="level" label="类型" width="100" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.level == 1" type="info" size="small">菜单</el-tag>
                    <el-tag v-else type="warning" size="small">页面</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.status == 1" type="success" size="small">有效</el-tag>
                    <el-tag v-else type="danger" size="small">无效</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="control" label="操作权限" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    <div v-if="scope.row.level == 1" class="permission-text">/</div>
                    <div v-else-if="scope.row.control && scope.row.control.length > 0" class="permission-tags">
                        <el-tag 
                            v-for="(perm, index) in scope.row.control" 
                            :key="index" 
                            type="primary" 
                            size="small"
                            class="permission-tag"
                        >
                            {{ perm }}
                        </el-tag>
                    </div>
                    <div v-else class="permission-text">查看</div>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="280" align="center">
                <template #default="scope">
                    <div class="action-buttons">
                        <el-button link type="success" size="small" icon="Edit" @click.stop="edit.Open(scope.row)">修改</el-button>
                        <el-button link type="warning" size="small" icon="Close" @click.stop="toggleStatus(scope.row)">取消</el-button>
                        <el-popconfirm title="确定删除?" @confirm="Delete(scope.row.id)">
                            <template #reference>
                                <el-button link type="danger" size="small" icon="Delete" @click.stop>删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-button 
                            v-if="scope.row.level == 1" 
                            link 
                            type="warning" 
                            size="small" 
                            icon="Plus" 
                            @click.stop="addSubMenu(scope.row)"
                        >
                            +子菜单
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- <el-scrollbar style="white-space: nowrap;">
            <el-pagination
                :current-page="param.page"
                :page-size="param.limit"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                :pager-count="11"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="CurrentChange"
                @size-change="SizeChange"
                background
            />
        </el-scrollbar> -->
    </div>
    <Edit1 ref="edit" @query="Query"></Edit1>
</template>

<script setup>
    import Edit1 from './menuEdit.vue'
    const edit = ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({});
    const total = ref(0);
    const menuList1 = ref([])
    provide('menuList1', menuList1);
    const tableData = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中')
        axios.post('admin/links/list', param.value).then( res => {
            if (res.status == 200) {
                // Process data to ensure tree structure
                tableData.value = processTreeData(res.data);
                menuList1.value = res.data.filter(item => item.level == 1)
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
    
    //处理树形数据
    function processTreeData(data){
        if (!data || !Array.isArray(data)) return []
        return data.map(item => {
            const processed = { ...item }
            // Handle both 'childs' and 'children' property names
            const children = item.childs || item.children || []
            if (children && Array.isArray(children) && children.length > 0) {
                // Recursively process all nested children
                processed.childs = processTreeData(children)
            } else {
                // Explicitly set empty array if no children (required for tree table)
                processed.childs = []
            }
            return processed
        })
    }
    
    //获取路由名称
    function getRouteName(row){
        // Extract route name from path or use name
        if (row.path && row.path.includes('/')) {
            const parts = row.path.split('/')
            return parts[parts.length - 1] || row.name
        }
        return row.path || row.name || '-'
    }
    
    //切换状态
    function toggleStatus(row){
        const newStatus = row.status == 1 ? 0 : 1
        let loading = tips.loading('更新中')
        axios.post('/admin/links/edit', {
            id: row.id,
            status: newStatus
        }).then( res => {
            if (res.status == 200) {
                tips.success('操作成功')
                Query()
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
    
    //添加子菜单
    function addSubMenu(parentRow){
        // Open edit dialog with parent pre-selected
        const newItem = {
            level: 2,
            parent_id: parentRow.id,
            status: 1
        }
        edit.value.Open(newItem)
    }
    
    //重置
    function Reset(){
        param.value = {}
        Query()
    }
    
    //删除
    function Delete(id){
        let loading = tips.loading('删除中')
        axios.post('/admin/links/del', {id}).then( res => {
            if (res.status == 200) {
                Query()
                tips.success('删除成功')
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
    
    //数据表 多选
    function SelectionChange(ref){
        console.log(ref);
    }
    
    //当前页数 改变
    function CurrentChange (number){
        param.value.page = number;
        Query()
    }
    
    //每页大小 改变
    function SizeChange (number){
        param.value.limit = number;
        Query()
    }

</script>

<style scoped>
.menu-table {
    font-size: 14px;
}

.menu-name-cell {
    display: flex;
    align-items: center;
    gap: 8px;
}

.menu-icon {
    font-size: 16px;
}

.folder-icon {
    color: #409eff;
}

.file-icon {
    color: #909399;
}

.url-text {
    color: #606266;
    font-family: 'Courier New', monospace;
    font-size: 13px;
}

.route-text {
    color: #606266;
    font-size: 13px;
}

.permission-text {
    color: #909399;
}

.permission-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
}

.permission-tag {
    margin: 0;
}

.action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
}

/* Tree table styling */
:deep(.menu-table .el-table__row) {
    cursor: pointer;
}

:deep(.menu-table .el-table__row:hover) {
    background-color: #f5f7fa;
}

:deep(.menu-table .el-table__indent) {
    padding-left: 0;
}

/* Cell tooltip flex display */
:deep(.menu-table .cell.el-tooltip) {
    display: flex;
}

/* Expand icon height for tree rows */
:deep(.menu-table [class*=el-table__row--level] .el-table__expand-icon) {
    height: auto;
    padding-top: 6px;
}

/* Status badge styling */
:deep(.el-tag--success) {
    background-color: #67c23a;
    border-color: #67c23a;
    color: #fff;
}

:deep(.el-tag--danger) {
    background-color: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
}

:deep(.el-tag--info) {
    background-color: #909399;
    border-color: #909399;
    color: #fff;
}

:deep(.el-tag--warning) {
    background-color: #e6a23c;
    border-color: #e6a23c;
    color: #fff;
}
</style>