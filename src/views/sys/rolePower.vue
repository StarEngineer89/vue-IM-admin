<template>
    <el-dialog title="设置权限" v-model="isshow" top="5vh">
        <!-- :default-checked-keys="defaultKeys" -->
        <el-scrollbar height="70vh">
            <el-tree
                ref="tree" 
                v-if="isshow"
                :data="roleTree" 
                show-checkbox node-key="id" 
                default-expand-all 
                :expand-on-click-node="true"
                :props="{ label: 'name', class: customNodeClass }"
            />
        </el-scrollbar>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="isshow = false">取 消</el-button>
                <el-button type="primary" @click="Submit()">确 定</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance()
    const isshow = ref(false);
    const tree = ref(null)
    const param = ref({})
    const roleTree = ref([])
    const customNodeClass = res => {
        if(res.level == 2) return 'is-penultimate'
        else return ''
    }
    const emit = defineEmits(['query']); //emit('query'); 
    defineExpose({ Open })

    function Open( id ){
        param.value = { role: id }

        let loading = tips.loading('查询中');
        axios.post('admin/links/list', param.value).then( res => {
            if (res.status == 200) {
                roleTree.value = res.data;
                isshow.value = true;
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }

    function Submit(){
        param.value.link_ids = tree.value.getCheckedKeys();//.toString()
        //console.log(param.value);

        let loading = tips.loading('提交中');
        axios.post('/admin/roles/savePermissions', param.value).then( res => {
            if (res.status == 200) {
                tips.success('操作成功')
                isshow.value = false;
                //emit('query')
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
</script>

<style scoped>
    :deep(.is-penultimate > .el-tree-node__content) {
        color: #626aef;
    }
    :deep(.el-tree .el-tree-node .is-penultimate > .el-tree-node__children) {
        display: flex;
        flex-direction: row;
    }
    :deep(.is-penultimate > .el-tree-node__children > div) {
        margin-bottom: 5px;
    }
</style>