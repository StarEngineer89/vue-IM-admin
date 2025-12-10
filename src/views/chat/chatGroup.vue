<template>
    <div class="page">
        <div class="page-param">            
            <el-form-item label="时间">
                <el-date-picker
                    class="date-picker"
                    v-model="param.timeList"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    format="YYYY-MM-DD"
                    style="padding-right: 10px;"
                />
            </el-form-item>
            <el-form-item label="群名称">
                <el-input v-model="param.anme" prefix-icon="User" placeholder="请输入" clearable />
            </el-form-item>
            <el-button type="primary"  @click="Query">查询</el-button>
            <div style="flex: 1;"></div>
            <el-radio-group v-model="param.radio1">
                <el-radio value="1" size="large">最近3个月</el-radio>
                <el-radio value="2" size="large">3个月前</el-radio>
                <el-radio value="3" size="large">无效群记录</el-radio>
            </el-radio-group>
        </div>
        <div class="content">
           <el-scrollbar height="100%" style="width: 280px; padding: 20px; border-right: 1px solid #eee;">
                <div class="chat-anme" v-for="item in chatList" @click="GetChat(item.conver_id)">
                    <el-image class="avatar" :src="item.avatar"><template #error><span></span></template></el-image>
                    <div>
                        <div class="name">{{ item.nickname }}</div>
                        <div class="text">{{ item.last_msg }}</div>
                    </div>
                </div>
           </el-scrollbar>
           <el-scrollbar height="100%" style="flex: 1; padding: 20px;">
                <div class="chat-left" v-for="item in chatContent">
                    <el-image class="avatar" :src="item.from_avatar"><template #error><span></span></template></el-image>
                    <div class="chat" v-if="item.msg_type == 0">
                        <div class="text">{{ item.content }}</div>
                        <div class="time">{{ item.time }}</div>
                    </div>
                    <div class="chat" v-else-if="item.msg_type == 1">
                        <el-image class="chatImg" :src="item.content" fit="contain"><template #error><span></span></template></el-image>
                        <div class="time">{{ item.time }}</div>
                    </div>
                    <div class="chat" v-else-if="item.msg_type == 2">
                        <div class="text">[视频]</div>
                        <div class="time">{{ item.time }}</div>
                    </div>
                    <div class="chat" v-else-if="item.msg_type == 3">
                        <div class="text">[语音]</div>
                        <div class="time">{{ item.time }}</div>
                    </div>
                    <div class="chat" v-else-if="item.msg_type == 4">
                        <div class="text">[文件]</div>
                        <div class="time">{{ item.time }}</div>
                    </div>
                    <div class="chat" v-else>
                        <div class="text">[类型错误]</div>
                        <div class="time">{{ item.time }}</div>
                    </div>
                </div>
           </el-scrollbar>
        </div>
    </div>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance();
    const param = ref({});
    const chatList = ref([])
    const chatContent = ref([])

    setTimeout(()=>{ Query() }, 1)
    //查询
    function Query(){
        let loading = tips.loading('查询中');
        axios.post('/admin/convers/groupList', param.value).then( res => {
            if (res.status == 200) {
                 chatList.value = res.data;
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }

    function GetChat(id){
        let loading = tips.loading('查询中');
        axios.post('/admin/convers/chatHistory', {conver_id: id}).then( res => {
            if (res.status == 200) {
                chatContent.value = res.data;
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
        display: flex;
    }


    .chat-anme{
        cursor: pointer;
        display: flex;
        margin-bottom: 15px;
    }
    .chat-anme .avatar{
        border-radius: 10px;
        width: 50px;
        height: 50px;
        margin-right: 10px;
        background-color: #F6F6F6;
    }
    .chat-anme .name{
        margin-top: 2px;
        width: 200px;
        font-size: 18px;
        font-weight: bold;
        overflow: hidden;         
        white-space: nowrap;       
        text-overflow: ellipsis; 
    }
    .chat-anme .text{
        width: 200px;
        overflow: hidden;         
        white-space: nowrap;       
        text-overflow: ellipsis;  
    }


    .chat-left{
        margin-bottom: 15px;
         display: flex;
    }
    .chat-left .avatar{
        width: 50px;
        height: 50px;
        border-radius: 999px;
        margin-right: 10px;
    }
    .chat-left .chat{
        max-width: 1000px;
        padding: 20px;
        border-radius: 20px 20px 20px 0;
        background-color: #F6F6F6;
        font-size: 16px;
    }
    .chat-left .time{
        margin-top: 10px;
        font-size: 12px;
        text-align: right;
    }

    .chatImg{
        max-width: 260px;
        max-height: 260px;
    }
</style>