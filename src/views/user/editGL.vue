<template>
    <el-dialog :title="title" v-model="isshow" width="1000px" top="5vh" >
        <el-form>
            <el-form-item label="账号">
                <el-input  v-model="param.username" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="密码">
                <el-input  v-model="param.password" placeholder="请输入" type="password" clearable />
            </el-form-item>
            <el-form-item label="备注">
                <el-input  v-model="param.remark" placeholder="请输入" clearable />
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
            title.value = '用户编辑'
        }
        else{
            title.value = '新增用户'
        }
        isshow.value = true;
    }
    function Submit(){

    }
</script>

<style scoped></style>