<template>
    <el-dialog :title="title" v-model="isshow" width="500px" top="5vh" style="padding-right: 20px;">
        <el-form label-width="auto">
            <el-form-item label="UID" v-if="title == '新增邀请码'">
                <el-input  v-model="param.uid" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="邀请码"><el-input  v-model="param.invite_code" placeholder="请输入" clearable /> </el-form-item>
            <el-form-item label="欢迎语"><el-input  v-model="param.msg" placeholder="请输入" clearable /> </el-form-item>
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
    const title = ref('');
    const isshow = ref(false);
    const param = ref({})
    const emit = defineEmits(['query']); //emit('query');
    defineExpose({ Open });

    function Open(data){
        param.value = {};
        if(data){
            title.value = '编辑邀请码';
            const json = JSON.parse(JSON.stringify(data));
            param.value.uid = json.id;
            param.value.invite_code = json.invite_code;
            param.value.msg = json.default_msg;
        }
        else{
            title.value = '新增邀请码';
        }
        isshow.value = true;
    }

    function Submit(){
        axios.post( '/admin/invite_codes/edit', param.value ).then( res => {
            if(res.status == 200){
                tips.success('操作成功')
                emit('query')
                isshow.value = false;
            }
            else tips.error(res.msg);
        })
    } 
</script>

<style scoped>
</style>