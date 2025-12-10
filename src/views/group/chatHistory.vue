<template>
    <el-dialog title="聊天记录" v-model="isshow" width="800px" top="5vh" style="padding-right: 20px;">
       <el-scrollbar height="65vh" style="flex: 1; padding: 20px;">
                <div class="chat-left" v-for="item in chatContent">
                    <el-image class="avatar" :src="item.from_avatar"><template #error><span></span></template></el-image>
                    <div class="chat" v-if="item.msg_type == 0">
                        <div class="text">{{ item.content }}</div>
                        <div class="time">{{ item.time }}</div>
                    </div>
                    <div class="chat" v-else-if="item.msg_type == 1">
                        <el-image class="chatImg" :src="imgu" fit="contain"><template #error><span></span></template></el-image>
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

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="isshow = false">取消</el-button>
                <!-- <el-button type="primary" @click="Submit()">保存</el-button> -->
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance()
    const title = ref('');
    const isshow = ref(false);
    const param = ref({})
    const chatContent = ref([])
    const emit = defineEmits(['query']); //emit('query');
    defineExpose({ Open });

    function Open(id){
        let loading = tips.loading('查询中');
        axios.post( '/admin/convers/groupList', { group_id: id} ).then( res => {
            if(res.status == 200){
                chatContent.value = res.data;
            }
            else tips.error(res.msg);
        }).finally(()=>{ 
            loading.close();
            isshow.value = true;
        });
    }

    function Submit(){

    } 
</script>

<style scoped>
    .chat-left{
        margin-bottom: 15px;
         display: flex;
    }
    .chat-left .avatar{
        width: 50px;
        height: 50px;
        border-radius: 999px;
        margin-right: 10px;
        background-color: #F6F6F6;
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