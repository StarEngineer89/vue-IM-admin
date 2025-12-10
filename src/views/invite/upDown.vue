<template>
    <el-dialog :title="title" v-model="isshow" width="800px" top="5vh" style="padding-right: 20px;">
        
        <el-divider content-position="left">上级</el-divider>
        <el-table :data="upList" border >
            <el-table-column prop="id" label="UID" show-overflow-tooltip />
            <el-table-column prop="account" label="账号" show-overflow-tooltip />
            <el-table-column prop="nickname" label="昵称" show-overflow-tooltip />
            <el-table-column prop="invite_code" label="邀请码" show-overflow-tooltip />
        </el-table>
            
        <el-divider content-position="left">下级</el-divider>
        <el-table :data="downList" border max-height="55vh" >
            <el-table-column prop="id" label="UID" show-overflow-tooltip />
            <el-table-column prop="account" label="账号" show-overflow-tooltip />
            <el-table-column prop="nickname" label="昵称" show-overflow-tooltip />
            <el-table-column prop="invite_code" label="邀请码" show-overflow-tooltip />
        </el-table>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="isshow = false">取消</el-button>
                <!-- <el-button type="primary" @click="Submit()">保存</el-button> -->
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance()
    const title = ref('');
    const isshow = ref(false);
    const param = ref({})
    const upList = ref([])
    const downList = ref([])
    const emit = defineEmits(['query']); //emit('query');
    defineExpose({ Open });

    function Open(id){
        let loading = tips.loading('查询中');
        axios.post( '/admin/invite_codes/viewHierarchy', {uid: id}).then( res => {
            if(res.status == 200){
                let json = res.data.data;
                upList.value = json.up? [json.up]: [];
                downList.value = json.down;
            }
            else tips.error(res.msg);
        }).finally(()=>{ 
            loading.close();
            isshow.value = true;
         });
    }

    function Submit(){
        if(title.value == '新增角色'){
            axios.post( '/declare/role/add', param.value ).then( res => {
                if(res.code == 200){
                    tips.success('新增成功')
                    emit('query')
                    isshow.value = false;
                }
                else tips.error(res.msg);
            })
        }
        else{
            axios.post( '/declare/role/update', param.value ).then( res => {
                if(res.code == 200){
                    tips.success('编辑成功')
                    emit('query')
                    isshow.value = false;
                }
                else tips.error(res.msg);
            })
        }
    } 
</script>

<style scoped>
</style>