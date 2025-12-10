<template>
    <el-dialog v-model="isShow" title="便签" width="600px" top="15vh" draggable>
        <el-tabs tab-position="left">
            <el-tab-pane label="便签1">便签1</el-tab-pane>
            <el-tab-pane label="便签2">便签2</el-tab-pane>
            <el-tab-pane label="便签3">便签3</el-tab-pane>
            <el-tab-pane label="便签4">便签4</el-tab-pane>
        </el-tabs>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="isShow = false">取消</el-button>
                <!-- <el-button type="success" @click="Submit">新增</el-button> -->
                <el-button type="primary" @click="Submit">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
    const isShow = ref(false);
    const param = ref({});
    
    defineExpose({ Open }); //抛出数据(父级组件调用)
    //const emits = defineEmits(['funEditSubmit']);

    //打开
    function Open(){
        isShow.value = true;
    }
    //提交
    function Submit(){
        console.log(param.value);
        //emits('funEditSubmit', param.value);
    }
</script>
<style scoped></style>