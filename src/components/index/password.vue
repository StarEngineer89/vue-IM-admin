<template>
    <el-dialog title="修改密码" v-model="isshow" width="500px" top="5vh" >
        <el-form>
            <!-- <el-form-item label="旧密码">
                <el-input  v-model="param.password" placeholder="请输入" clearable :disabled="title == '账号编辑'" />
            </el-form-item> -->
            <el-form-item label="新密码">
                <el-input  v-model="param.password" placeholder="请输入" type="password" clearable />
            </el-form-item>
            <!-- <el-form-item label="密码确认">
                <el-input  v-model="param.password" placeholder="请输入" type="password" clearable />
            </el-form-item> -->
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
    import { token, userInfo } from '@/store'
    const { proxy: { axios, tips } } = getCurrentInstance()
    const isshow = ref(false);
    const param = ref({})
    const emit = defineEmits(['query']); //emit('query');  uid, password, remark userInfo
    defineExpose({ Open })

    function Open(){
        param.value = {};
        isshow.value = true;
    }
    function Submit(){
        let loading = tips.loading('操作中');
        param.value.uid = userInfo.value.uid
        axios.post('/admin/admin/pass', param.value).then( res => {
            if (res.status == 200) {
                tips.success('操作成功')
                isshow.value = false
            }
            else tips.error(res.msg)
        }).finally(()=>{ loading.close(); });
    }
</script>

<style scoped></style>