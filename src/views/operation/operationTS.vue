<template>
    <div class="page-t">
        <el-scrollbar class="page-param" max-height="126px" style="margin-bottom: 5px;">
            <el-form :inline="true">
                <el-form-item label="投诉标题">
                    <el-input  v-model="param.title" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="用户昵称">
                    <el-input  v-model="param.username" placeholder="请输入" clearable />
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <el-scrollbar style="white-space: nowrap; margin-bottom: 10px;">
            <el-button v-blur type="primary" icon="Search" @click="Query">  查询</el-button>
            <el-button v-blur type="warning" icon="RefreshLeft" @click="funReset">  重置</el-button>
            <!-- <el-button v-blur type="danger" icon="Delete"  @click="funDeletes">删除</el-button>
            <el-button v-blur type="success" icon="Plus">添加</el-button>
            <el-button v-blur type="info" icon="Download">导出</el-button> -->
        </el-scrollbar>

        <el-table :data="tableData.slice(0, 100)" @selection-change="SelectionChange" border max-height="100vh - 350px">
            <el-table-column fixed type="selection" width="38" />
            <el-table-column prop="" label="序号" width="70" >
                <template #default="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column>
            <el-table-column prop="title" label="投诉标题"  show-overflow-tooltip />
            <el-table-column prop="content" label="投诉内容"  show-overflow-tooltip />
            <el-table-column prop="nickname" label="投诉用户"  show-overflow-tooltip />
            <el-table-column prop="status" label="状态"  show-overflow-tooltip >
                <template #default="scope">{{ scope.row.status == 1 ? '待处理' : '已关闭' }}</template>
            </el-table-column>

            <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
                <el-button link type="primary" icon="Edit" @click.prevent="edit.Open(scope.row.id)">处理</el-button>
                <el-popconfirm title="确定删除?" @confirm="Delete(scope.row.id)">
                    <template #reference><el-button link type="danger" icon="Delete" >删除</el-button></template>
                </el-popconfirm>
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
    </div>
    <Edit1 ref="edit" @query="Query"></Edit1>
</template>

<script setup>
    import Edit1 from './editTS.vue';
    const edit =  ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({page:1, limit:20});
    const total = ref(0);
    const tableData = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中')
        axios.post('/admin/complaints/list', param.value).then( res => {
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
    function Delete(){
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
    function funDelete(index, row){
        //console.log(row);
        // Message.confirm('确认删除?', ()=>{
        //     Message.success('操作成功！');
        // });
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

<style scoped></style>