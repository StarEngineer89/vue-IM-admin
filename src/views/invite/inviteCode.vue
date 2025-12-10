<template>
    <div class="page-t">
        <el-scrollbar class="page-param" max-height="126px" style="margin-bottom: 5px;">
            <el-form :inline="true">
                <el-form-item label="邀请码">
                    <el-input  v-model="param.invite_code" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="UID">
                    <el-input  v-model="param.uid" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input  v-model="param.nickname" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="param.status" placeholder="请选择" clearable>
                        <el-option label="正常" :value="1" />
                        <el-option label="禁用" :value="0" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <el-scrollbar style="white-space: nowrap; margin-bottom: 10px;">
            <el-button v-blur type="primary" icon="Search" @click="Query">查询</el-button>
            <el-button v-blur type="warning" icon="RefreshLeft" @click="funReset">重置</el-button>
            <el-button v-blur type="success" icon="Plus" @click.prevent="edit.Open(null)">添加</el-button>
            <!-- <el-button v-blur type="danger" icon="Delete"  @click="funDeletes">删除</el-button>
            <el-button v-blur type="info" icon="Download">导出</el-button> -->
        </el-scrollbar>

        <el-table :data="tableData" @selection-change="SelectionChange" border max-height="100vh - 350px">
            <el-table-column fixed type="selection" width="38" />
            <el-table-column prop="" label="序号" width="70" >
                <template #default="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column>
            <el-table-column prop="invite_code" label="邀请码"  show-overflow-tooltip />
            <el-table-column prop="id" label="UID"  show-overflow-tooltip />
            <el-table-column prop="nickname" label="昵称"  show-overflow-tooltip />
            <el-table-column prop="status" label="状态"  show-overflow-tooltip >
                <template #default="scope"> {{ scope.row.status == 1? '正常' : '禁用' }} </template>
            </el-table-column>
            <el-table-column prop="default_msg" label="欢迎语"  show-overflow-tooltip />
            <el-table-column prop="datetime" label="创建时间"  show-overflow-tooltip />
            <el-table-column prop="use_count" label="使用次数"  show-overflow-tooltip />
            <el-table-column prop="" label="上下级"  show-overflow-tooltip >
                <template #default="scope"><el-button link type="primary" @click.prevent="upDown.Open(scope.row.id)">查看</el-button></template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click.prevent="edit.Open(scope.row)">编辑</el-button>
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
    </div>
    <Edit1 ref="edit" @query="Query"></Edit1>
    <UpDown ref="upDown"></UpDown>
</template>

<script setup>
    import UpDown from './upDown.vue';
    import Edit1 from './edit.vue';
    const upDown = ref(null);
    const edit =  ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({page:1, limit:20});
    const total = ref(0);
    const tableData = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中')
        axios.post('/admin/invite_codes', param.value).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.list;
                total.value = res.data.count;
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
    // https://chatapi.ab25888.cc/admin/invite_codes
    // 查询参数: invite_code, uid, account, status
    // 排序: sort (0: time, 1: invite_code, 2: uid, 3: nickname)

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