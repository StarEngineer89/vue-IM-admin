<template>
    <div class="page-t">
        <div class="page-header">
            <el-scrollbar class="page-param" max-height="126px" style="margin-bottom: 5px;">
                <el-form :inline="true">
                    <el-form-item label="后台用户">
                        <el-input v-model="param.account" placeholder="请输入" clearable style="width: 180px;" />
                    </el-form-item>
                    <!-- <el-form-item label="登录名/昵称">
                        <el-input v-model="param.keyword" placeholder="请输入登录名或昵称" clearable style="width: 180px;" />
                    </el-form-item> -->
                    <el-form-item label="角色">
                        <el-select v-model="param.role_id" placeholder="全部" clearable style="width: 150px;">
                            <el-option label="全部" value="" />
                            <el-option 
                                v-for="role in rolesList" 
                                :key="role.id" 
                                :label="role.role" 
                                :value="role.id" 
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="param.status" placeholder="全部" clearable style="width: 120px;">
                            <el-option label="全部" :value="null" />
                            <el-option label="正常" :value="1" />
                            <el-option label="禁用" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-blur type="primary" icon="Search" @click="Query">查询</el-button>
                        <el-button v-blur type="warning" icon="RefreshLeft" @click="funReset">重置</el-button>
                        <el-button v-blur type="success" icon="Plus" @click.prevent="edit.Open(null)">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-scrollbar>
        </div>

        <el-table :data="tableData" @selection-change="SelectionChange" border max-height="calc(100vh - 350px)" v-loading="loading">
            <el-table-column fixed type="selection" width="55" align="center" />
            <el-table-column prop="id" label="用户ID" width="90" align="center" show-overflow-tooltip />
            <el-table-column prop="account" label="用户名" min-width="120" show-overflow-tooltip />
            <el-table-column prop="nickname" label="昵称" min-width="120" show-overflow-tooltip>
                <template #default="scope">
                    {{ scope.row.nickname || scope.row.account || '--' }}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="100" show-overflow-tooltip>
                <template #default="scope">
                    {{ scope.row.name || '--' }}
                </template>
            </el-table-column>
            <el-table-column prop="phone" label="电话" min-width="130" show-overflow-tooltip>
                <template #default="scope">
                    {{ scope.row.phone || '--' }}
                </template>
            </el-table-column>
            <el-table-column prop="department" label="部门" min-width="100" show-overflow-tooltip>
                <template #default="scope">
                    {{ scope.row.department || '--' }}
                </template>
            </el-table-column>
            <el-table-column prop="position" label="职位" min-width="100" show-overflow-tooltip>
                <template #default="scope">
                    {{ scope.row.position || '--' }}
                </template>
            </el-table-column>
            <el-table-column prop="roles" label="所属角色" min-width="180" show-overflow-tooltip>
                <template #default="scope">
                    <div v-if="getRolesArray(scope.row).length > 0" class="role-tags">
                        <el-tag 
                            v-for="(role, index) in getRolesArray(scope.row)" 
                            :key="index" 
                            type="primary" 
                            size="small"
                            class="role-tag"
                        >
                            {{ role }}
                        </el-tag>
                    </div>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.status == 1 || scope.row.status == undefined" type="success" size="small">正常</el-tag>
                    <el-tag v-else type="danger" size="small">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="220" align="center">
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click.prevent="edit.Open(scope.row)">修改</el-button>
                    <el-popconfirm title="确定删除?" @confirm="Delete(scope.row.id)">
                        <template #reference>
                            <el-button link type="danger" icon="Delete" @click.prevent>删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button link type="warning" icon="Key" @click.prevent="openResetPassword(scope.row)">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-scrollbar style="white-space: nowrap;">
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
        </el-scrollbar>
        
        <Edit1 ref="edit" @query="Query"></Edit1>
        
        <!-- 重置密码模态框 -->
        <el-dialog v-model="resetPasswordDialog" title="重置密码" width="500px" top="5vh">
            <el-form :model="resetPasswordForm" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model="resetPasswordForm.account" disabled />
                </el-form-item>
                <el-form-item label="新密码" required>
                    <el-input 
                        v-model="resetPasswordForm.password" 
                        type="password" 
                        placeholder="请输入新密码" 
                        show-password
                        clearable 
                    />
                </el-form-item>
                <el-form-item label="确认密码" required>
                    <el-input 
                        v-model="resetPasswordForm.confirmPassword" 
                        type="password" 
                        placeholder="请再次输入新密码" 
                        show-password
                        clearable 
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="resetPasswordDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitResetPassword">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
    import Edit1 from './userEdit.vue';
    const edit =  ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({page:1, limit:20});
    const total = ref(0);
    const tableData = ref([])
    const rolesList = ref([])
    const loading = ref(false)
    const resetPasswordDialog = ref(false)
    const resetPasswordForm = ref({
        id: '',
        account: '',
        password: '',
        confirmPassword: ''
    })

    setTimeout(()=>{ 
        Query()
        loadRoles()
    }, 1)
    
    //查询
    function Query(){
        loading.value = true;
        // Prepare query params with proper status value
        const queryParams = { ...param.value };
        // Convert status: empty string/null/undefined to null, ensure integer for 1 or 0
        if(queryParams.status === '' || queryParams.status === null || queryParams.status === undefined){
            queryParams.status = null;
        } else if(typeof queryParams.status === 'string'){
            queryParams.status = parseInt(queryParams.status);
        }
        // Ensure status is either null, 1 (int), or 0 (int)
        axios.post('/admin/admin/list', queryParams).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.list || [];
                total.value = res.data.count || 0;
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.value = false; });
    }
    //重置
    function funReset(){
        param.value = {page:1, limit:20};
        Query()
    }
    //批量 删除
    function funDeletes(){
        // Message.confirm('批量删除 8条?', ()=>{
        //     Message.success('操作成功！');
        // });
    }
    //编辑
    function funEdit(index, row){
        edit.value.Open(row);
    }
    //编辑 提交
    function funEditSubmit(data){
        console.log(data);
    }
    //删除
    function Delete(id){
        let loading = tips.loading('删除中');
        axios.post('/admin/admin/del', {uid: id}).then( res => {
            if (res.status == 200) {
                tips.success('删除成功')
                Query()
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
    //加载角色列表
    function loadRoles(){
        axios.post('/admin/roles/list', {}).then( res => {
            if (res.status == 200) {
                rolesList.value = res.data.roles || [];
            }
        });
    }
    //打开重置密码对话框
    function openResetPassword(row){
        resetPasswordForm.value = {
            id: row.id,
            account: row.account || row.username || '',
            password: '',
            confirmPassword: ''
        };
        resetPasswordDialog.value = true;
    }
    //获取角色数组（处理字符串、数组等不同格式）
    function getRolesArray(row){
        // 如果 roles 是数组，直接返回
        if(Array.isArray(row.roles)){
            return row.roles;
        }
        // 如果 role 是对象，提取 role.role 属性
        if(row.role && typeof row.role === 'object' && !Array.isArray(row.role)){
            return row.role.role ? [row.role.role] : [];
        }
        // 如果 role 是数组，直接返回
        if(Array.isArray(row.role)){
            return row.role;
        }
        // 如果 roles 是字符串，尝试解析
        if(typeof row.roles === 'string'){
            try {
                const parsed = JSON.parse(row.roles);
                if(Array.isArray(parsed)){
                    return parsed;
                }
            } catch(e) {
                // 如果不是JSON，当作单个角色处理
                return row.roles ? [row.roles] : [];
            }
        }
        // 如果 role 是字符串，返回数组
        if(typeof row.role === 'string' && row.role){
            return [row.role];
        }
        // 如果 role_name 存在
        if(row.role_name){
            return [row.role_name];
        }
        return [];
    }
    //提交重置密码
    function submitResetPassword(){
        if(!resetPasswordForm.value.password){
            tips.error('请输入新密码');
            return;
        }
        if(resetPasswordForm.value.password !== resetPasswordForm.value.confirmPassword){
            tips.error('两次输入的密码不一致');
            return;
        }
        if(resetPasswordForm.value.password.length < 6){
            tips.error('密码长度不能少于6位');
            return;
        }
        
        let loading = tips.loading('重置中');
        axios.post('/admin/admin/pwd', {
            uid: resetPasswordForm.value.id,
            password: resetPasswordForm.value.password
        }).then( res => {
            if (res.status == 200) {
                tips.success('密码重置成功');
                resetPasswordDialog.value = false;
                resetPasswordForm.value = {
                    id: '',
                    account: '',
                    password: '',
                    confirmPassword: ''
                };
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }

</script>

<style scoped>
.page-t {
    padding: 20px;
    background-color: #fff;
}

.page-header {
    margin-bottom: 15px;
    padding: 15px;
    background-color: #fafafa;
    border-radius: 4px;
}

.page-param {
    background-color: #fff;
    padding: 10px;
    border-radius: 4px;
}

.role-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.role-tag {
    margin: 0;
}

:deep(.el-table) {
    font-size: 14px;
}

:deep(.el-table th) {
    background-color: #f5f7fa;
    font-weight: 600;
    color: #606266;
}

:deep(.el-table td) {
    padding: 12px 0;
}

:deep(.el-button--link) {
    padding: 0 8px;
    font-size: 13px;
}

:deep(.el-tag) {
    border-radius: 4px;
    font-weight: 500;
}

:deep(.el-form-item) {
    margin-bottom: 15px;
    margin-right: 20px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
}
</style>