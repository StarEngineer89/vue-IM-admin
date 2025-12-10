<template>
    <el-dialog :title="title" v-model="isshow" width="500px" top="5vh" >
        <el-form>
            <el-form-item label="角色名称">
                <el-input  v-model="param.name" placeholder="请输入" clearable :disabled="title == '账号编辑'" />
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
    const param = ref({})
    const emit = defineEmits(['query']); //emit('query'); 
    defineExpose({ Open })

    function Open( data ){
        param.value = {};
        if(data){
            title.value = '编辑角色'
            let json = JSON.parse(JSON.stringify(data))
            param.value.role = json.id;
            param.value.name =  json.role;
        }
        else{
            title.value = '新增角色'
        }
        isshow.value = true;
    }
    function Submit(){
        if(title.value == '新增角色'){
            let loading = tips.loading('提交中');
            axios.post('/admin/roles/add', param.value).then( res => {
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
            axios.post('/admin/roles/saveName', param.value).then( res => {
                if (res.status == 200) {
                    tips.success('编辑成功')
                    isshow.value = false;
                    emit('query')
                }
                else tips.error(res.msg)
            }).finally(()=>{ loading.close(); });
        }
    }
</script>

<style scoped></style>