<template>
    <div class="page-t">
        <el-scrollbar class="page-param" max-height="126px" style="margin-bottom: 5px;">
            <el-form :inline="true">
                <el-form-item label="账号">
                    <el-input  v-model="param.account" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="IP">
                    <el-input  v-model="param.ip" placeholder="请输入" clearable />
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <el-scrollbar style="white-space: nowrap; margin-bottom: 10px;">
            <el-button v-blur type="primary" icon="Search" @click="Query">  查询</el-button>
            <el-button v-blur type="warning" icon="RefreshLeft" @click="funReset">  重置</el-button>
            <el-button v-blur type="success" icon="Plus" @click.prevent="edit.Open(null)">添加</el-button>
            <!-- <el-button v-blur type="danger" icon="Delete"  @click="funDeletes">删除</el-button>
            <el-button v-blur type="info" icon="Download">导出</el-button> -->
        </el-scrollbar>

        <el-table :data="tableData.slice(0, 100)" @selection-change="SelectionChange" border max-height="100vh - 350px">
            <el-table-column fixed type="selection" width="38" />
            <el-table-column prop="" label="序号" width="70" >
                <template #default="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column>
            <el-table-column prop="id" label="UID" show-overflow-tooltip />
            <el-table-column prop="account" label="账号" show-overflow-tooltip />
            <el-table-column prop="datetime" label="注册时间" show-overflow-tooltip />
            <el-table-column prop="logintime" label="登入时间" show-overflow-tooltip />
            <el-table-column prop="remark" label="备注" show-overflow-tooltip />
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click.prevent="edit.Open(scope.row)">  编辑</el-button>
                    <el-button link type="danger" icon="Delete"  @click.prevent="Delete(scope.row.id)">删除</el-button>
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
    </div>
</template>

<script setup>
    import Edit1 from './userEdit.vue';
    const edit =  ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({page:1, limit:20});
    const total = ref(0);
    const tableData = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中');
        axios.post('/admin/admin/list', param.value).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.list;
                total.value = res.data.count;
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
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

</script>

<style scoped>
    .avatar{
        width: 40px;
        height: 40px;
        border-radius: 999px;
    }
</style>