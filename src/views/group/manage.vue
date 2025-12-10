<template>
    <el-dialog title="群聊成员" v-model="isshow" width="800px" top="5vh" style="padding-right: 20px;">
        <el-table :data="tableList" border max-height="60vh">
            <el-table-column prop="avatar" label="头像" show-overflow-tooltip >
                <template #default="scope">
                    <el-image class="avatar" :src="scope.row.avatar"><template #error><span></span></template></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="uid" label="UID" show-overflow-tooltip />
            <el-table-column prop="nickname" label="昵称" show-overflow-tooltip />
            <el-table-column prop="is_admin" label="是否管理" show-overflow-tooltip >
                <template #default="scope">{{ scope.row.is_admin == 1 ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template #default="scope">
                    <el-popconfirm title="确定移除?" @confirm="Delete(scope.row.gid, scope.row.uid)">
                        <template #reference><el-button link type="danger" icon="SwitchButton">移除</el-button></template>
                    </el-popconfirm>
                </template>
            </el-table-column>
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
        axios.post( '/admin/group/info', { gid: id} ).then( res => {
            if(res.status == 200){
                tableList.value = res.data.members;
                isshow.value = true;
            }
            else tips.error(res.msg);
        }).finally(()=>{  loading.close(); });
    }

    function Delete(gid, uid){
        let loading = tips.loading('操作中');
        axios.post( '/admin/group/removemem', { gid: gid, uids: [uid]} ).then( res => {
            if(res.status == 200){
                tips.success(res.msg)
                Open(gid);
            }
            else tips.error(res.msg);
        }).finally(()=>{  loading.close(); });
    } 
</script>

<style scoped>
    .avatar{
        border-radius: 999px;
        width: 40px;
        height: 40px;
        margin-right: 10px;
        background-color: #f5f5f5;
    }
</style>