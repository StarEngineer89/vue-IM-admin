<template>
    <div id="mx-header" v-second="OnSecond">
        <div class="left">
            <el-tooltip :content="MenuFold?'展开 F1':'折叠 F1'" placement="left" :enterable="false" :hide-after="0"> 
                <el-icon  v-if="!MenuFold" @click="MenuFold = true"  size="20"><Fold /></el-icon>
                <el-icon  v-else           @click="MenuFold = false" size="20"><Expand /></el-icon>
            </el-tooltip>
            <el-tooltip content="刷新 F2" placement="left" :enterable="false" :hide-after="0">
                <el-icon @click="OnRefresh" size="19"><Refresh /></el-icon>
            </el-tooltip>
            <el-tooltip content="便签 F3" placement="left" :enterable="false" :hide-after="0">
                <el-icon @click="memo.Open()"><EditPen /></el-icon>
            </el-tooltip>
            <el-tooltip content="搜索 F4" placement="left" :enterable="false" :hide-after="0">
                <el-icon ><Search /></el-icon>
            </el-tooltip>
            <el-tooltip content="清空页面 F6" placement="left" :enterable="false" :hide-after="0">
                <el-icon ><DocumentRemove /></el-icon>
            </el-tooltip>
            <el-tooltip content="多页面" placement="left" :enterable="false" :hide-after="0">
                <el-icon ><DocumentCopy /></el-icon>
            </el-tooltip>
            <el-tooltip content="日历 F7" placement="left" :enterable="false" :hide-after="0">
                <el-icon ><Calendar /></el-icon>
            </el-tooltip>
        </div>
        <div class="right">
            <div class="currentTime"></div>
            <!-- <el-tooltip :content="isDark?'浅色 F10':'深色 F10'" placement="left" :enterable="false" :hide-after="0">
                    <el-icon class="butDrck" v-if="isDark" @click="ToggleDark"  ><Moon /></el-icon>
                    <el-icon class="butDrck" v-else        @click="ToggleDark" size="21" ><Sunny /></el-icon>
            </el-tooltip> -->
            <el-tooltip content="全屏 F11" placement="left" :enterable="false" :hide-after="0">
                <el-icon @click="ToggleFullscreen" size="17"><FullScreen /></el-icon>
            </el-tooltip>
            <el-tooltip content="通知 F12" placement="left" :enterable="false" :hide-after="0">
                <el-icon><Bell /></el-icon>
            </el-tooltip>
            <!-- 头像 -->
            <el-dropdown> 
                <span class="el-dropdown-link">
                    <el-image class="mx-avatar" url="" fit="contain"> <template #error> <el-icon class="error-slot"><Avatar /></el-icon> </template> </el-image>
                    <span style="margin-left: 5px;">admin</span>
                    <el-icon><arrow-down /></el-icon>
                </span>
                <template #dropdown>
                <el-dropdown-menu >
                    <!-- <el-dropdown-item icon="User" @click="personal.Open()">个人资料</el-dropdown-item> -->
                    <el-dropdown-item icon="Edit" @click="password.Open()">修改密码</el-dropdown-item>
                    <el-dropdown-item icon="Delete" @click="tips.success('操作成功')">清空缓存</el-dropdown-item>
                    <el-dropdown-item icon="SwitchButton" @click="SignOut()">安全退出</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <Memo ref="memo" />
    <Personal ref="personal" />
    <Password ref="password" />
</template>

<script setup>
    import { useRoute , useRouter } from 'vue-router'
    import { ToggleFullscreen, ToggleDark } from '@/assets/utils/sys-common.js'
    import { isDark } from '@/store'
    const { proxy: { axios, tips } } = getCurrentInstance()
    const Memo = defineAsyncComponent(() => import('./Memo.vue')); //便签 
    const memo = ref(null);
    const Personal = defineAsyncComponent(() => import('./Personal.vue')); //个人资料
    const personal = ref(null);
    const Password = defineAsyncComponent(() => import('./Password.vue'));
    const password = ref(null);
    const router = useRouter();

    const MenuFold = inject('MenuFold'); //菜单折叠
    const TabIndex = inject('TabIndex');
    const TabArray = inject('TabArray');
    
    /** 小刷新 */
    function OnRefresh(){
        let i = TabArray.value.findIndex(item => item.index === TabIndex.value);
        if(i > -1){
            TabArray.value[i].refresh = false;
            nextTick(()=>{
                TabArray.value[i].refresh = true;
            });
        }
    }

    /** 秒定时器 */
    function OnSecond(){
        const now = new Date()
        document.querySelector('.currentTime').innerHTML = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss').value
        //document.querySelector('.currentTime').innerHTML = dayjs().format('YYYY-MM-DD HH:mm:ss ddd');
    }
    /** 安全退出 */
    function SignOut(){
        router.replace('/login');
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
            case 'F1':  event.preventDefault(); MenuFold.value? MenuFold.value=false: MenuFold.value=true; break;
            case 'F2':  event.preventDefault(); OnRefresh();        break;
            case 'F10': event.preventDefault(); OnDark();           break;
            case 'F11': event.preventDefault(); ToggleFullscreen(); break;
            //case 'F12': event.preventDefault(); break;
        }
    }

    /** 模拟鼠标（切换深色按钮） */
    function OnDark (){
        const element = document.querySelector('.butDrck');
        const {x, y} = element.getBoundingClientRect(); //获取元素坐标 信息
        // 创建一个鼠标点击事件对象
        let clickEvent = new MouseEvent('click', {
            bubbles: true,      //表示事件是否冒泡，默认为 false，这里设置为 true 表示事件会冒泡 
            cancelable: true,   //表示事件是否可以被取消，默认为 false，这里设置为 true 表示可以取消。
            view: window,       //与事件关联的视图，通常是 window
            detail: 1,          //是事件的详细信息，对于 click 事件，detail 为 1 表示单击，2 表示双击
            clientX: x,         
            clientY: y + 8 
        });
        element.dispatchEvent(clickEvent);
    }
</script>

<style scoped>
    #mx-header{
        overflow: hidden;
        height: var(--mx-header-height);
        border-bottom: 1px solid #f2f4f5;
        display: flex;
        padding-left: 20px;
        padding-right: 20px;
    }
    #mx-header .left{
        flex: 1;
        display: flex;
        align-items: center;
    }
    #mx-header .right{
        display: flex;
        align-items: center;
    }
    #mx-header  .currentTime{
        margin-right: 30px;
    }
    #mx-header  .el-dropdown-link{
        cursor: pointer;
        display: flex;
        align-items: center;

        outline: none;
        border: none;
    }

    #mx-header .el-icon{
        margin-right: 30px;
        font-size: 1.3rem; 
    }
    #mx-header .el-icon:hover{
        cursor: pointer;
    }
</style>