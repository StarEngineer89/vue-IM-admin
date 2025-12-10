<template>
    <div class="page">
        <div class="page-param">            
            <!-- <el-form-item label="时间">
                <el-date-picker
                    class="date-picker"
                    v-model="param.timeList"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="YYYY-MM-DD"
                    style="padding-right: 10px;"
                />
            </el-form-item> -->
            <el-form-item label="开始时间">
                <el-date-picker v-model="param.fromDate" type="date" placeholder="请选择" />
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker v-model="param.toDate" type="date" placeholder="请选择" />
            </el-form-item>
            <el-button type="primary"  @click="Query">查询</el-button>
            <div style="flex: 1;"></div>
            <el-radio-group v-model="param.radio1">
                <el-radio value="1" size="large">有效群</el-radio>
                <el-radio value="2" size="large">无效群</el-radio>
            </el-radio-group>
        </div>

        <el-scrollbar class="content">
            <el-collapse v-model="active" v-for="(value, key) in tableData" style="width: 50%;">
                <el-collapse-item :title="`${key} 当日新增${value}个团体`" :name="key">
                </el-collapse-item>
            </el-collapse>
        </el-scrollbar>
    </div>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance()
    const param = ref({})
    const tableData = ref([])
    const active = ref();

    setTimeout(()=>{ Query() }, 1)
    
    //查询
    function Query(){
        let loading = tips.loading('查询中');
        axios.post('/admin/groups/history', param.value).then( res => {
            if (res.status == 200) {
                tableData.value = res.data.list;
                total.value = res.data.count;
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