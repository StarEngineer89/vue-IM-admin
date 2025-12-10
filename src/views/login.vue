<template>
    <div id="mx-login">

        <div class="content">
            <span class="title">{{ titleName }}</span>
            <span class="title1">欢迎使用 微企通后台</span>

            <el-form ref="formEl" :rules="FormRules" :model="param" >
                <el-form-item prop="account">
                    <el-input v-model="param.username" prefix-icon="User" placeholder="用户名" clearable />
                </el-form-item>
                <el-form-item prop="password">
                    <el-input  v-model="param.password" prefix-icon="Lock" type="password" placeholder="密码" show-password clearable />
                </el-form-item>     
                <el-form-item prop="code">
                    <p style="display: flex;">
                        <el-input ref="tcode" v-model="param.captcha" prefix-icon="CircleCheck" placeholder="图形验证码" maxlength="4" clearable />
                        <!-- <canvas width="130" height="38" id="captcha1" style="margin-left: 10px;"></canvas> -->
                        <img class="captcha" :src="captchaUrl" @click="GetCaptcha"></img>
                    </p>
                </el-form-item>
                <!-- <el-input class="row" v-model="param.code1" prefix-icon="Cellphone" placeholder="令牌" clearable /> -->
            </el-form>

            <!-- <div class="handle">
                <el-checkbox id="mx-save" label="记住密码" @change="Change" :checked="isSave" />
                <el-button v-blur link type="primary">忘记密码?</el-button>
            </div> -->
            <el-button class="but-login" v-blur color="#009688" @click="Login">登入</el-button>
            <el-button class="but-other" v-blur link type="primary">其他登入方式></el-button>
        </div>

        <span class="explain">© 2025 多界面系统</span>
    </div>
</template>

<script setup>
    import JSEncrypt from 'jsencrypt';
    import { token as tokenS, userInfo } from '@/store'
    //import { Message } from '@/assets/script/message';
    import { useRoute , useRouter } from 'vue-router'
    const { proxy: { axios, tips } } = getCurrentInstance();
    const router = useRouter();
    const formEl = ref(null);
    const tcode = ref(null);

    const titleName = document.title; 
    const param = ref({});
    const isSave = ref(false); //是否保存

    const captchaUrl = ref('');
    const publicKey = ref('')

    param.value.username = 'jyadmin'
    param.value.password = 'asdqwe123'

    GetCaptcha()
    let captchaKey = '';
    function GetCaptcha(){
        axios.get('/admin/captcha' ).then( res => {
            //console.log(res);
            if (res.status == 200) {
                captchaUrl.value = res.data.img;
                captchaKey = res.data.key;
            }else tips.error(res.msg)
        })
        //captchaUrl.value = window['apiurl'] +'/admin/captcha?v=' +  new Date().getTime();
    }   
    
    /** 表单验证 */ 
    const FormRules = {
        //<el-form-item prop="key" :rules="[]"> 可以直接写在这里（动态添加的时候使用）
        username: [
            { required: true, message: '请输入帐号', trigger: 'null' }, 
            { min: 4, max: 10, message: '长度应为4到10', trigger: 'null' },
            { validator: (rule, value, callback)=>{
                let zz = /^[a-zA-Z0-9\u4e00-\u9fa5]*$/;
                if ( value && !zz.test(value) ) callback( '帐号只能是字母数字汉字' ); //new Error('')
                else callback();
            }, trigger: 'null' },
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'null' },
            { min: 6, max: 20, message: '长度应为6到20', trigger: 'null' },
        ],
        captcha: [
            { required: true, message: '请输入图形验证码', trigger: 'null' }, 
        ]
    }; 


    const generateRandomString = (length) =>{
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; // 可选字符集
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
	};
    const encryptWithRSA = (publicKey, message) => {
        const encryptor = new JSEncrypt();
        encryptor.setPublicKey(publicKey);
        return encryptor.encrypt(message);
	};

    axios.post('/admin/base', {}).then(({ data, status, msg }) => {
        if (status == 200) {
            publicKey.value = atob(data.publicKey);
        }else tips.error(res.msg)
    })

    /** 登入 */
    function Login() {
        //await async 异步方法
        formEl.value.validate((valid, fields) => {
            if (valid) {
                const api_token = generateRandomString(32);
                const token = param.value.password + '|' + api_token;
                const _token = encryptWithRSA(publicKey.value, token);

                let loading = tips.loading('登入中');
                axios.post('/admin/login', {
                    username: param.value.username,
                    token:_token,
                    captcha: param.value.captcha,
                    key: captchaKey
                }).then( res => {
                    if (res.status == 200) {
                        tips.success('登入成功')
                        tokenS.value = res.data.token;
                        userInfo.value = res.data.user;
                        router.replace('/');
                    }
                    else tips.error(res.msg)
                }).finally(()=>{ loading.close(); });
            } 
            else{
                window.setTimeout(()=>{ 
                    formEl.value.clearValidate(); //删除 验证提示  
                    //formEl.value.resetFields(); //删除 验证提示（重置表单）
                }, 4000)
            }
        })
    }

    /** 记住密码 */
    function Change(e){
        //isSave.value = e;
    }

    //挂载后
    onMounted(()=>{
        document.addEventListener('keydown', onKeydown);
    })

    //销毁前
    onBeforeUnmount(()=>{
        document.removeEventListener('keydown', onKeydown);
    })

    /** 监听键盘 */
    const onKeydown = event => {
        //console.log(event.code);
        switch (event.code) {
            case 'Enter': Login(); break;
        }
    }
</script>

<style scoped>
    #mx-login{
        height: 100%;
        background-color: #f2f2f2;
        display: flex;
        justify-content: center; 
        align-items: center;
    }
    #mx-login .content{
        margin-top: -20vh;
        width: 335px;
    }
    #mx-login .title{
        display: block;
        width: 100%;
        text-align: center;
        font-size: 2rem;
        /* text-shadow: 2px 2px 2px #c0c4cc; */
    }
    #mx-login .title1{
        margin-bottom: 20px;
        display: block;
        width: 100%;
        line-height: 26px;
        text-align: center;
        color: #666;
        text-shadow: 2px 3px 0px #c0c4cc;
    }
    #mx-login .el-input{
        --el-component-size: 38px;
        --el-border-color-hover: #f2f2f2;
        --el-color-primary: #c0c4cc;
    }
    :deep(.el-input__wrapper) {
        border-radius: 2px !important;
    }

    /* 操作 记住密码 */
    #mx-login .handle{
        width: 100%;
        /* height: 46px; */
        display: flex;
        justify-content: space-between; 
        align-items: center;
    }

    #mx-login .but-login{
        width: 100%;
        height: 38px;
    }
    #mx-login .but-other{
        margin:5px -2px;
    }

    /* 说明 */
    #mx-login .explain{
        position: fixed;
        bottom: 0;
        line-height: 40px;
        display: flex;
        justify-content: center;
        color: #666;
    }


    .captcha{
        cursor: pointer;
        margin-left: 5px;
        width: 120px; 
        height: 38px;
    }
</style>