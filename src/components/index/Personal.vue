<template>
    <el-dialog v-model="isShow" title="个人资料" width="600px" top="15vh" draggable>
        <!-- label-position="right" -->
        <el-form label-width="80px">
            <el-form-item>
                <!-- <div class="demo-image__preview"></div>    -->
                <el-image class="mx-avatar" :src="param.avatar" :preview-src-list="[param.avatar]" fit="contain"> 
                    <template #error> <el-icon class="error-slot"><Avatar /></el-icon> </template> 
                </el-image>
                <p style="width: 10px;"></p>
                <input type="file" id="file" name="file" style="display:none" @change="funAvatar" accept="image/*" />
                <el-button type="primary" link onclick="document.getElementById('file').click()">更改</el-button>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input v-model="param.account" placeholder="用户名" disabled clearable />
            </el-form-item>
            <el-form-item label="昵称">
                <el-input v-model="param.name" placeholder="昵称" clearable />
            </el-form-item>
            <el-form-item label="性别">
                <el-input style="display: none;" />
                <el-radio-group v-model="param.sex" >
                    <el-radio border :value="1" >男</el-radio>
                    <el-radio border :value="2" >女</el-radio>
                    <el-radio border :value="0" >保密</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="手机">
                <el-input v-model="param.phone" placeholder="手机" clearable />
            </el-form-item>
            <el-form-item label="邮箱">
                <el-input id="mailbox" v-model="param.mailbox" placeholder="邮箱" clearable />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="param.city" placeholder="密码为空 不做修改" show-password clearable />
            </el-form-item>
            <el-form-item label="备注">
                <el-input type="textarea" v-model="param.remarks" placeholder="备注" :autosize="{ minRows: 2, maxRows: 4 }" clearable />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="isShow = false">取消</el-button>
                <el-button type="primary" @click="Submit">提交</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
    const isShow = ref(false);
    const param = ref({
        avatar: '',
        name: '明心',
        sex: 0,
        account: 'admin',
        phone: '17777777777',
        mailbox: '123@qq.xom',
        remarks: ''
    });
    
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

    //选着头像
    function funAvatar(){
        let files = document.getElementById( "file" );
        let file = files.files[0];
        document.getElementById('file').value = '';
        //图片转base64
        let reader = new FileReader();
        reader.readAsDataURL(file);  
        reader.onload = function(){
            let base64 = reader.result;
            param.value.avatar = base64;
        };
    }
</script>
<style scoped></style>