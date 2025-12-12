<template>
    <div class="page-t">
        <el-scrollbar class="page-param" max-height="126px" style="margin-bottom: 5px;">
            <el-form :inline="true">
                <el-form-item label="UID">
                    <el-input  v-model="param.uid" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input  v-model="param.nickname" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="账号">
                    <el-input  v-model="param.account" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item>
                    <el-button v-blur type="primary" icon="Search" @click="Query">  查询</el-button>
                    <el-button v-blur type="warning" icon="RefreshLeft" @click="funReset">  重置</el-button>
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <el-table :data="tableData.slice(0, 100)" @selection-change="SelectionChange" border max-height="100vh - 350px">
            <el-table-column fixed type="selection" width="38" />
            <el-table-column prop="" label="序号" width="70" >
                <template #default="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column>
            <!-- <el-table-column prop="" label="头像" show-overflow-tooltip /> -->
            <el-table-column prop="id" label="UID"  show-overflow-tooltip />
            <el-table-column prop="nickname" label="昵称" show-overflow-tooltip />
            <el-table-column prop="account" label="账号"  show-overflow-tooltip />
            <el-table-column prop="" label="角色"  show-overflow-tooltip />
            <el-table-column prop="gender" label="性别" show-overflow-tooltip >
                <template #default="scope">
                    <span v-if="scope.row.gender == 1">男</span>
                    <span v-else-if="scope.row.gender == 2">女</span>
                    <span v-else>保密</span>
                </template>
            </el-table-column>
            <el-table-column prop="user_type" label="类型" show-overflow-tooltip >
                <template #default="scope">
                    <span v-if="scope.row.user_type == 0">普通用户</span>
                    <span v-else-if="scope.row.user_type == 1">客服</span>
                    <span v-else-if="scope.row.user_type == 2">假人</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column prop="money" label="余额"  show-overflow-tooltip />
            <el-table-column prop="invite_code" label="邀请码" show-overflow-tooltip />
            <el-table-column prop="datetime" label="注册时间" show-overflow-tooltip />
            <el-table-column prop="last_time" label="登入时间"  show-overflow-tooltip />
            <!-- <el-table-column prop="" label="来源"  show-overflow-tooltip /> -->
            <!-- <el-table-column prop="" label="封禁状态"  show-overflow-tooltip /> -->
            <!-- <el-table-column prop="" label="账号状态"  show-overflow-tooltip /> -->
、
            <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
                <el-button link type="primary" icon="Edit" @click.prevent="funEdit(scope.$index, scope.row)">  编辑</el-button>
                <!-- <el-button link type="danger" icon="Delete"  @click.prevent="funDelete(scope.$index, scope.row)">删除</el-button> -->
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
        
        <Edit1 ref="edit"></Edit1>
    </div>
</template>

<script setup>
    import Edit1 from './editGL.vue';
    const edit =  ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({page:1, limit:20});
    const total = ref(0);
    const tableData = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中')
        axios.post('/admin/user/list', param.value).then( res => {
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