<template>
    <div id="RightMenu" v-show="isShow1" @click="Hide1" @contextmenu="Hide2">

        <el-popover placement="right-start" :visible="isShow2" :auto-close="2000" @after-leave="AfterLeave">
            <template #reference>
                <div id="MenuPosition"></div>
            </template>
            <div style="width: 100%; height: 100%; display: flex; flex-wrap: wrap; justify-content: center;align-content: center;">
                <el-button type="info" link @click="CloseTab(1)">关闭其他页面</el-button>
                <el-divider />
                <el-button type="info" link @click="CloseTab(2)">关闭全部页面</el-button>
            </div>
        </el-popover>

    </div>
</template>

<script setup>
    const isShow1 = ref(false);
    const isShow2 = ref(false);
    const menuPositionRef = ref();
    const popoverRef = ref();
    const onClickOutside = () => {
        unref(popoverRef).menuPositionRef?.delayHide?.()
    }
    const TabIndex = inject('TabIndex');
    const TabArray = inject('TabArray');

    let t1 = null;
    onMounted(()=>{
        let element1 = document.querySelector( '.el-tabs__nav-scroll' ); //可激活区域
        let element2 = document.getElementById( 'MenuPosition' );

        element1.addEventListener('contextmenu', event => {
            event.preventDefault();  // 阻止默认事件
            element2.style.left = event.x + 'px';
            element2.style.top  = event.y + 'px';
            isShow1.value = true;
            isShow2.value = true;
        });

    })

    // if(t1) window.clearInterval(t1);
    // t1 = window.setTimeout(()=>{ isShow2.value = false;}, 2000);

    /** 关闭tab页面 */
    function CloseTab( i ){
        if(i === 1){
            //关闭其他
            TabArray.value = TabArray.value.filter(item => item.index === TabIndex.value);
        }
        else{
            //关闭全部
            TabIndex.value = '';
            TabArray.value =  [];
        }
        isShow2.value = false; 
    }

    /** popover组件隐藏后触发 */
    function AfterLeave(){
        isShow1.value = false;
    }
    function Hide1(event){ 
        isShow2.value = false;
    }
    function Hide2(event){
        event.preventDefault();
        isShow2.value = false;
    }
</script>

<style scoped>
    #RightMenu{
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 8;
        width: 100%;
        height: 100%;
    }
    #MenuPosition{
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 9;
    }
    .el-divider--horizontal{
        margin: 6px 0;
    }
</style>