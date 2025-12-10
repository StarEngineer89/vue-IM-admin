<template>
    <div class="page">
        <div class="custom">
            <el-statistic title="用户总数" :value="counts.users" />
            <el-statistic title="今日注册" :value="counts.logins" />
            <el-statistic title="今日登入" :value="counts.registers" />
            <el-statistic title="当前在线" :value="counts.online_users" />
        </div>
        
        <div style="width: 100%; display: flex; justify-content: flex-end; margin-bottom: 10px;">
            <div style="width: 300px; height: 34px;margin-right: 30px;">
                <el-date-picker
                    class="date-picker"
                    v-model="timeList"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="YYYY-MM-DD"
                    style="width: 100%; height: 100%;"
                />
            </div>
            <el-button type="primary">查询</el-button>
        </div>

        <div style="display: flex;">
            <div class="echarts-map">
                <Map ref="map"></Map>
            </div>
            <div class="echarts-pie">
                <Pie ref="pie"></Pie>
            </div>
        </div>
    </div>
</template>

<script setup>
    import Map from '@/components/echarts/map.vue'
    import Pie from '@/components/echarts/pie.vue'
    const map = ref(null)
    const pie = ref(null)
    const { proxy: { axios, tips } } = getCurrentInstance();
    const counts = ref({})
    const timeList = ref([])

    setTimeout(()=>{
        
        GetCounts().then(()=>{
            GetMap().then(()=>{
                GetPie().then(()=>{})
            })
        })

    }, 1)

    /** 统计数据 */
    function GetCounts(){
        return axios.post('/admin/analyse/today', {}).then( res => {
            if (res.status == 200) {
                counts.value = res.data;
            }
            else tips.error(res.msg)
        })
    }
    /** 获取地图数据 */
    function GetMap(){
        return axios.post('/admin/analyse/locations', {}).then( res => {
            if (res.status == 200) {
                //console.log(res.data);
                map.value.Open(res.data)
            }
            else tips.error(res.msg)
        })
    }
    /** 获取饼图数据 */
    function GetPie(){
        return axios.post('/admin/analyse/devices', {}).then( res => {
            if (res.status == 200) {
                //console.log(res);
                pie.value.Open(res.data)
            }
            else tips.error(res.msg)
        })
    }


// 登录人数, 使用户登录统计  
// https://api.lidachat.com/admin/analyse/countLogins
// params: fromDate, toDate

// 注册人数, 使用户注册统计
// https://api.lidachat.com/admin/analyse/countSignups
// params: fromDate, toDate
</script>

<style scoped>
    .page{
        width: 100%;
        height: auto;
    }
    .custom{
        display: flex;
        flex-wrap: wrap;
    }
    .el-statistic{
        flex: 1;
        padding: 25px 0;
        min-width: 220px;
        background-color: #fff;
        text-align: center;
        white-space: nowrap;
        /* height: auto; */
        border-radius: 5px;
        margin-right: 15px;
        margin-bottom: 15px;
    }
    .el-statistic:last-child{
        margin-right: 0px;
    }

    .echarts-map{
        width: 65%;
        margin-right: 15px;
        height: calc(100vh - 300px);
        background-color: #fff;
    }
    .echarts-pie{
        flex: 1;
        background-color: #fff;
    }
</style>