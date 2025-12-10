<template>
    <div class="page-t">
        <el-scrollbar class="page-param" max-height="126px" style="margin-bottom: 5px;">
            <el-form :inline="true">
                <el-form-item label="角色名称">
                    <el-input  v-model="param.name" placeholder="请输入" clearable />
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <el-scrollbar style="white-space: nowrap; margin-bottom: 10px;">
            <el-button v-blur type="primary" icon="Search" @click="Query">  查询</el-button>
            <el-button v-blur type="warning" icon="RefreshLeft" @click="Reset">  重置</el-button>
            <el-button v-blur type="success" icon="Plus" @click="edit.Open(null)">添加</el-button>
            <!-- <el-button v-blur type="danger" icon="Delete"  @click="funDeletes">删除</el-button>
            <el-button v-blur type="info" icon="Download">导出</el-button> -->
        </el-scrollbar>

        <el-table :data="tableData" @selection-change="SelectionChange" border max-height="100vh - 350px">
            <el-table-column fixed type="selection" width="38" />
            <el-table-column prop="" label="序号" width="70" >
                <template #default="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column>
            <!-- <el-table-column prop="" label="头像" show-overflow-tooltip /> -->
            <el-table-column prop="id" label="ID"  show-overflow-tooltip />
            <el-table-column prop="role" label="角色名称" show-overflow-tooltip />
            <el-table-column prop="users_count" label="下级数量"  show-overflow-tooltip />
            <el-table-column prop="add_time" label="创建时间"  show-overflow-tooltip />
            <el-table-column fixed="right" label="操作" width="240">
            <template #default="scope">
                <el-button link type="primary" icon="Edit" @click.prevent="edit.Open(scope.row)">编辑</el-button>
                <el-button link type="success" icon="Edit" @click.prevent="power.Open(scope.row.id)">权限</el-button>
                <el-popconfirm title="确定删除?" @confirm="Delete(scope.row.id)">
                    <template #reference><el-button link type="danger" icon="Delete" >删除</el-button></template>
                </el-popconfirm>
            </template>
            </el-table-column>
        </el-table>

        <!-- <el-scrollbar style="white-space: nowrap;">
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
        </el-scrollbar> -->
    </div>
    <Edit1 ref="edit" @query="Query"></Edit1>
    <Power ref="power" @query="Query"></Power>
</template>

<script setup>
    import Edit1 from './roleEdit.vue';
    import Power from './rolePower.vue';
    const edit =  ref(null)
    const power =  ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({});
    const total = ref(0);
    const tableData = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中')
        axios.post('/admin/roles/list', param.value).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.roles;
                //total.value = res.data.count;
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
    //重置
    function Reset(){
        param.value = {};
        Query()
    }
    //删除
    function Delete(id){
        let loading = tips.loading('删除中')
        axios.post('/admin/roles/delete', {role: id}).then( res => {
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

<style scoped></style>