<template>
    <div class="page-t">
        <el-scrollbar class="page-param" max-height="126px" style="margin-bottom: 5px;">
            <el-form :inline="true">
                <el-form-item label="菜单名称">
                    <el-input  v-model="param.name" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="层级">
                    <el-select v-model="param.level" placeholder="请选择" clearable>
                        <el-option label="一级菜单" :value="1" />
                        <el-option label="二级菜单" :value="2" />
                        <el-option label="页面按钮" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="param.status" placeholder="请选择" clearable>
                        <el-option label="开启" :value="1" />
                        <el-option label="关闭" :value="0" />
                    </el-select>
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

        <el-table :data="tableData" row-key="id" @selection-change="SelectionChange" border max-height="100vh - 250px">
            <el-table-column fixed type="selection" width="38" />
            <!-- <el-table-column prop="" label="序号" width="70" >
                <template #default="scope"> {{ scope.$index + 1 }} </template>
            </el-table-column> -->
            <!-- <el-table-column prop="" label="头像" show-overflow-tooltip /> -->
            <el-table-column prop="id" label="ID"  show-overflow-tooltip />
            <el-table-column prop="level" label="层级" show-overflow-tooltip >
                <template #default="scope">
                    <span v-if="scope.row.level == 1">一级菜单</span>
                    <span v-else-if="scope.row.level == 2">二级菜单</span>
                    <span v-else-if="scope.row.level == 3">页面按钮</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column prop="icon" label="图标"  show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="菜单名称"  show-overflow-tooltip />
            <el-table-column prop="path" label="路径"  show-overflow-tooltip />
            <el-table-column prop="status" label="状态" show-overflow-tooltip >
                <template #default="scope">
                    <span v-if="scope.row.status == 1">开启</span>
                    <span v-else>关闭</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
            <template #default="scope">
                <el-button link type="primary" icon="Edit" @click.prevent="edit.Open(scope.row)">  编辑</el-button>
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
</template>

<script setup>
    import Edit1 from './menuEdit.vue'
    const edit =  ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({});
    const total = ref(0);
    const menuList1 = ref([])
    provide('menuList1', menuList1);
    const tableData = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中')
        axios.post('admin/links/list', param.value).then( res => {
            if (res.status == 200) {
                // let data = res.data;
                // let _tableData = [];
                // for(let key in data){
                //     _tableData.push(data[key]);
                // }
                tableData.value = res.data;
                menuList1.value = res.data.filter(item => item.level == 1)
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
    //重置
    function Reset(){
        param.value = {}
        Query()
    }
    //删除
    function Delete(id){
        let loading = tips.loading('删除中')
        axios.post('/admin/links/del', {id}).then( res => {
            if (res.status == 200) {
                Query()
                tips.success('删除成功')
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