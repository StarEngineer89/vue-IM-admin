<template>
    <el-dialog title="处理回复" v-model="isshow" width="500px" top="5vh" >
        <el-form>
            <el-form-item label="回复内容">
                <el-input v-model="param.reply" placeholder="请输入" type="textarea" :rows="5" maxlength="300" show-word-limit clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="isshow = false">取消</el-button>
                <el-button type="primary" @click="Submit()">保存</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
    const { proxy: { axios, tips } } = getCurrentInstance()
    const title = ref('')
    const isshow = ref(false);
    const param = ref({});
    const emit = defineEmits(['query']); //emit('query'); 
    defineExpose({ Open });

    function Open(data){
        if(data){
            param.value = {
                cid: data.id || data.cid,
                reply: data.reply || data.reply_content || ''
            };
        }
        else{
            param.value = {
                cid: '',
                reply: ''
            };
        }
        isshow.value = true;
    }
    function Submit(){
        let loading = tips.loading('操作中')
        axios.post('/admin/complaints/saveReply', param.value).then( res => {
            if (res.status == 200) {
                tips.success('操作成功')
                emit('query')
                isshow.value = false
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); })
    }

    // cid, reply
</script>

<style scoped></style>