<template>
    <div class="page">
        <div class="page-param">            
            <el-form-item label="时间">
                <el-date-picker
                    class="date-picker"
                    v-model="param.timeList"
                    type="daterange"
                    range-separator="To"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    style="padding-right: 10px;"
                />
            </el-form-item>
            <el-form-item label="群名称">
                <el-input v-model="param.anme" prefix-icon="User" placeholder="请输入" clearable />
            </el-form-item>
            <el-button type="primary" @click="Query()">查询</el-button>
            <div style="flex: 1;"></div>
            <el-radio-group v-model="param.radio1">
                <el-radio value="1" size="large">最近3个月</el-radio>
                <el-radio value="2" size="large">3个月前</el-radio>
                <el-radio value="3" size="large">无效群记录</el-radio>
            </el-radio-group>
        </div>

        <el-scrollbar class="content">
            <el-collapse v-model="active" v-for="(value, key) in tableData" style="width: 50%;">
                <el-collapse-item :title="`${key} 当日${value.total}人登录`" :name="key">
                </el-collapse-item>
            </el-collapse>
        </el-scrollbar>
    </div>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({});
    const active = ref(''); //折叠激活
    const tableData = ref([])

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中')
        axios.post('/admin/analyse/countLogins', param.value).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.list;
                //otal.value = res.data.count;
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
</script>

<style scoped>
    .page{
        width: 100%;
        height: 100%;
        background-color: #fff;
    }
    .page-param{
        display: flex;
        padding: 0 20px;
        border-bottom: 1px solid #eee;
    }
    .el-form-item{
        margin-right: 10px;
    }

    .content{
        height: calc(100vh - 180px);
        padding: 20px;
    }
</style>