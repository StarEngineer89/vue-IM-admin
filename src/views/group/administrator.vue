<template>
    <el-dialog title="群管理员" v-model="isshow" width="800px" top="5vh" style="padding-right: 20px;">
        <el-table :data="tableList" border >
            <el-table-column prop="avatar" label="头像" show-overflow-tooltip >
                <template #default="scope">
                    <el-image class="avatar" :src="scope.row.avatar"><template #error><span></span></template></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="uid" label="UID" show-overflow-tooltip />
            <el-table-column prop="nickname" label="昵称" show-overflow-tooltip />
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
    const tableList = ref([])
    const emit = defineEmits(['query']); //emit('query');
    defineExpose({ Open });

    function Open(id){
        let loading = tips.loading('查询中');
        axios.post( '/admin/groups/getAdmin', { gID: id} ).then( res => {
            if(res.status == 200){
                tableList.value = res.data;
            }
            else tips.error(res.msg);
        }).finally(()=>{ 
            loading.close();
            isshow.value = true;
        });
    }

    function Submit(){

    } 
</script>

<style scoped>
    .avatar{
        border-radius: 999px;
        width: 50px;
        height: 50px;
        margin-right: 10px;
        background-color: #f5f5f5;
    }
</style>