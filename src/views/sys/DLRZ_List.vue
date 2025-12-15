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
                <el-form-item label="时间">
                <el-date-picker
                    v-model="param.timeList"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    style="width: 300px; margin-right: 10px;"
                /></el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="param.role_id" placeholder="请选择" clearable style="width: 120px;">
                        <el-option 
                            v-for="role in rolesList" 
                            :key="role.id" 
                            :label="role.role" 
                            :value="role.id" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button v-blur type="primary" icon="Search" @click="Query">  查询</el-button>
                    <el-button v-blur type="warning" icon="RefreshLeft" @click="funReset">  重置</el-button>
                </el-form-item>
                
            </el-form>
        </el-scrollbar>

        <el-table :data="tableData" @selection-change="SelectionChange" border max-height="100vh - 350px">
            <el-table-column fixed type="selection" width="38" />
            <el-table-column prop="" label="序号" width="70" >
                <template #default="scope"> {{ (param.page - 1) * param.limit + scope.$index + 1 }} </template>
            </el-table-column>
            <el-table-column prop="id" label="UID" show-overflow-tooltip />
            <el-table-column prop="account" label="账号" show-overflow-tooltip />
            <el-table-column prop="device" label="平台" show-overflow-tooltip />
            <el-table-column prop="login_city" label="地址" show-overflow-tooltip />
            <el-table-column prop="login_ip" label="IP" show-overflow-tooltip />
            <el-table-column prop="login_time" label="登入时间" show-overflow-tooltip />
            <!-- <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click.prevent="funEdit(scope.$index, scope.row)">  编辑</el-button>
                    <el-button link type="danger" icon="Delete"  @click.prevent="funDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>

        <el-scrollbar style="white-space: nowrap;">
            <el-pagination
                :current-page="param.page"
                :page-size="param.limit"
                :total="total"
                :page-sizes="[10, 20, 50, 100]"
                :pager-count="11"
                :hide-on-single-page="false"
                layout="total, sizes, prev, pager, next, jumper"
                @current-change="CurrentChange"
                @size-change="SizeChange"
                background
            />
        </el-scrollbar>
        
        <!-- <Edit1 ref="edit"></Edit1> -->
    </div>
</template>

<script setup>
    //import Edit1 from './edit-gl.vue';
    const edit =  ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({page:1, limit:20});
    const total = ref(0);
    const tableData = ref([])
    const rolesList = ref([])

    setTimeout(()=>{ 
        Query()
        loadRoles()
    }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中');
        axios.post('/admin/admin/logins', param.value).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.list;
                total.value = res.data.count || res.data.total || (res.data.list?.length ?? 0);
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
    //加载角色列表
    function loadRoles(){
        axios.post('/admin/roles/list', {}).then( res => {
            if (res.status == 200) {
                rolesList.value = res.data.roles || [];
            }
            else tips.error(res.msg)
        });
    }

</script>

<style scoped>
    .avatar{
        width: 40px;
        height: 40px;
        border-radius: 999px;
    }
</style>