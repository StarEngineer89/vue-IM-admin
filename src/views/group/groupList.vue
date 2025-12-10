<template>
    <div class="page-t">
        <el-scrollbar class="page-param" max-height="126px" style="margin-bottom: 5px;">
            <el-form :inline="true" label-width="68px" >
                <el-form-item label="群ID">
                    <el-input v-model="param.gID" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="群主">
                    <el-input v-model="param.manager" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="param.status" placeholder="请选择" clearable>
                        <el-option label="开启" :value="1" />
                        <el-option label="关闭" :value="2" />
                    </el-select>
                </el-form-item>
            </el-form>
        </el-scrollbar>

        <el-scrollbar style="white-space: nowrap; margin-bottom: 10px;">
            <el-button v-blur type="primary" icon="Search" @click="Query">  查询</el-button>
            <el-button v-blur type="warning" icon="RefreshLeft" @click="Reset">  重置</el-button>
            <!-- <el-button v-blur type="danger" icon="Delete"  @click="funDeletes">删除</el-button>
            <el-button v-blur type="success" icon="Plus">添加</el-button>
            <el-button v-blur type="info" icon="Download">导出</el-button> -->
        </el-scrollbar>

        <el-table :data="tableData" @selection-change="SelectionChange" border max-height="100vh - 350px" table-layout="auto">
            <el-table-column fixed type="selection" width="38" />
            <el-table-column prop="id" label="序号" width="70" show-overflow-tooltip />
            <el-table-column prop="name" label="群聊" show-overflow-tooltip />
            <el-table-column prop="member_count" label="成员" show-overflow-tooltip />
            <el-table-column prop="nickname" label="群主" show-overflow-tooltip />
            <el-table-column prop="" label="管理员" show-overflow-tooltip>
                <template #default="scope"><el-button link type="primary" @click.prevent="administrator.Open(scope.row.id)">查看</el-button></template>
            </el-table-column>
            <!-- <el-table-column prop="" label="上限" show-overflow-tooltip /> -->
            <el-table-column prop="" label="全员禁言" show-overflow-tooltip >
                <template #default="scope"> {{ scope.row.is_jin == 1? '开启' : '关闭' }} </template>
            </el-table-column>
            <el-table-column prop="" label="禁言名单" show-overflow-tooltip >
                <template #default="scope"><el-button link type="primary" @click.prevent="userMute.Open(scope.row.id)">查看</el-button></template>
            </el-table-column>
            <!-- <el-table-column prop="" label="投诉纪录" show-overflow-tooltip >
                <template #default="scope"><el-button link type="primary" @click.prevent="">查看</el-button></template>
            </el-table-column> -->
            <!-- <el-table-column prop="" label="停封记录" show-overflow-tooltip >
                <template #default="scope"><el-button link type="primary" @click.prevent="">查看</el-button></template>
            </el-table-column> -->
            <el-table-column prop="" label="聊天记录" show-overflow-tooltip >
                <template #default="scope"><el-button link type="primary" @click.prevent="chatHistory.Open(scope.row.id)">查看</el-button></template>
            </el-table-column>
            <el-table-column prop="status" label="状态" show-overflow-tooltip >
                <template #default="scope"> {{ scope.row.status == 1? '正常' : '禁用' }} </template>
            </el-table-column>
            <el-table-column prop="login_time" label="登入时间" show-overflow-tooltip />
            <el-table-column fixed="right" label="操作" width="180">
                <template #default="scope">
                    <el-button link type="primary" icon="Edit" @click.prevent="manage.Open(scope.row.id)">群管理</el-button>
                    <el-popconfirm title="确定封停?" @confirm="Delete(scope.row.id)">
                        <template #reference><el-button link type="danger" icon="SwitchButton">封停</el-button></template>
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
    <Administrator ref="administrator"></Administrator>
    <UserMute ref="userMute"></UserMute>
    <ChatHistory ref="chatHistory"></ChatHistory>
    <Manage ref="manage"></Manage>
</template>

<script setup>
    import Administrator from './administrator.vue';
    import UserMute from './userMute.vue';
    import ChatHistory from './chatHistory.vue';
    import Manage from './manage.vue';
    const administrator = ref(null);
    const userMute = ref(null);
    const chatHistory = ref(null);
    const manage = ref(null);
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({page:1, limit:20});
    const total = ref(0);
    const tableData = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中');
        axios.post('/admin/groups/list', param.value).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.list;
                total.value = res.data.count;
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }

    //重置
    function Reset(){
        param.value = {page:1, limit:20};
    }
    //删除
    function Delete(id){
        let loading = tips.loading('操作中');
        axios.post('/admin/group/ban', {gid: id}).then( res => {
            if (res.status == 200) {
                tips.success(res.msg)
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