<template>
    <el-dialog :title="title" v-model="isshow" width="500px" top="5vh" >
        <el-form>
            <el-form-item label="账号">
                <el-input  v-model="param.username" placeholder="请输入" clearable :disabled="title == '编辑角色'" />
            </el-form-item>
            <el-form-item label="密码" v-if="title == '新增角色'">
                <el-input  v-model="param.password" placeholder="请输入" type="password" clearable />
            </el-form-item>
            <el-form-item label="角色">
                <el-select 
                    v-model="param.role_id" 
                    placeholder="请选择角色" 
                    clearable 
                    style="width: 100%;"
                >
                    <el-option 
                        v-for="role in rolesList" 
                        :key="role.id" 
                        :label="role.role" 
                        :value="role.id" 
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input  v-model="param.remark" placeholder="请输入" clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="isshow = false">取消</el-button>
                <el-button type="primary" @click="Submit()">保存</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance()
    const isshow = ref(false);
    const title = ref('')
    const param = ref({});
    const rolesList = ref([])
    const emit = defineEmits(['query']); //emit('query'); 
    defineExpose({ Open });


    function Open(data){
        param.value = {};
        loadRoles();
        if(data){
            title.value = '编辑角色'
            param.value.uid = data.id;
            param.value.username = data.account;
            param.value.remark = data.remark;
            // Don't include password when editing
            delete param.value.password;
            // Set role_id from data.role (object with id), data.role_id, data.role_ids, or data.roles
            if(data.role && typeof data.role === 'object' && data.role.id){
                // If role is an object with id property (from API response)
                param.value.role_id = data.role.id;
            } else if(data.role_id){
                param.value.role_id = data.role_id;
            } else if(data.role_ids && Array.isArray(data.role_ids) && data.role_ids.length > 0){
                // If role_ids is an array, take the first one
                param.value.role_id = data.role_ids[0];
            } else if(data.roles && Array.isArray(data.roles) && data.roles.length > 0){
                // If roles is an array, extract the first role ID
                const firstRole = data.roles[0];
                param.value.role_id = typeof firstRole === 'object' ? firstRole.id : firstRole;
            } else {
                param.value.role_id = '';
            }
        }
        else{
            title.value = '新增角色'
            param.value.role_id = '';
        }
        isshow.value = true;
    }
    function Submit(){
        if(title.value == '新增角色'){
            let loading = tips.loading('提交中');
            axios.post('/admin/admin/add', param.value).then( res => {
                if (res.status == 200) {
                    tips.success('新增成功')
                    isshow.value = false;
                    emit('query')
                }
                else tips.error(res.msg)
            }).finally(()=>{ loading.close(); });
        }
        else{
            let loading = tips.loading('提交中');
            axios.post('/admin/admin/edit', param.value).then( res => {
                if (res.status == 200) {
                    tips.success('编辑成功')
                    isshow.value = false;
                    emit('query')
                }
                else tips.error(res.msg)
            }).finally(()=>{ loading.close(); });
        }
    }
    //加载角色列表
    function loadRoles(){
        axios.post('/admin/roles/list', {}).then( res => {
            if (res.status == 200) {
                rolesList.value = res.data.roles || [];
            }
        });
    }
</script>

<style scoped></style>