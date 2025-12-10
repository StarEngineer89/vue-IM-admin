<template>
    <div id="mx-main">
        <el-tabs v-show="TabArray.length > 0" v-model="TabIndex" @tab-remove="funRemoveTab" type="card" closable> 
            <el-tab-pane v-for="item in TabArray" :key="item.index" :label="item.name" :name="item.index">
                <el-scrollbar style="height: 100%;">
                    <div class="scrollbar">
                        <router-view :name="item.path" v-if="item.refresh" />
                    </div>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
    <RightMouse></RightMouse>
</template>

<script setup>
    const RightMouse = defineAsyncComponent(() => import('./RightMouse.vue')); 

    const TabIndex = inject('TabIndex');  // 选中Tab 绑定 <el-tab-pane> 上的name值
    const TabArray = inject('TabArray');  // .slice(1)
    
    //删除tab（参考文档）
    function funRemoveTab(index){
        const Tabs = TabArray.value;
        let ActiveIndex = TabIndex.value; // 选中的 Tab
        if (ActiveIndex === index) {
            for(let i in Tabs){
                if(Tabs[i].index === index){
                    const NextTab = Tabs[i + 1] || Tabs[i - 1]; //补替
                    if (NextTab) ActiveIndex = NextTab.index;
                    else ActiveIndex = '0';
                }
            }
        }
        TabIndex.value = ActiveIndex;
        TabArray.value = Tabs.filter(item => item.index !== index);
    }
</script>

<style scoped>
    #mx-main{
        width: 100%;
        height: 100%;
        /* background-color: #909399; */
        /* background-color: #f2f2f2; */
        background-color: #f2f4f5;
    }
    .scrollbar{
        height: calc(100% - 32px);
        padding: 16px;
    }
</style>

<!-- 标签页样式 -->
<style scoped>
    .el-tabs {
        height: 100%;
        --el-tabs-header-height: 36px; /*  tab标签高度 */
    }
    /* ======================================================================================== Tabs 头部 */
    :deep(.el-tabs__header) {
        margin: 0;
        border: none !important;
        background-color: #fff;
    }
    :deep(.el-tabs__header .el-tabs__nav) {
        border: none !important;
    } 
    /* ======================================================================================== Tabs 内容 */
    :deep(.el-tabs__content) {
        height: calc(100% - var(--el-tabs-header-height)); 
    }
    /* ======================================================================================== el-tabs__content 子类 */
    :deep(.el-tab-pane) {
        height: 100%; /* 不配置 页面没有高度 */
    }

    /* ======================================================================================== Tabs 左右按钮 */
    :deep(.el-tabs__nav-next), :deep(.el-tabs__nav-prev) {
        background-color: #313131;
        height: var(--el-tabs-header-height);
        width: 22px;
        color: #fff;
        font-size: 18px;
        display: flex; 
        justify-content: center;
        align-items: center;
    }
    /* ======================================================================================== Tabs 标签 */
    :deep(.el-tabs__item) {
        border: none !important;
        color: #666;
        padding:0 16px !important;
    }
    /* 选中的标签 */
    :deep(.el-tabs .is-active){
        background-color: #f2f4f5;
        color: #409eff;
        font-weight: bold;
    }
    :deep(.el-tabs__item:focus-visible) {        
        border-radius: 3px;       
        box-shadow: none; /*默认会有蓝色阴影*/     
    }
    :deep(.is-icon-close) {
        width: 0 !important;
        height: 96%;
        /* font-size: 1.5rem; */
        position: absolute;
        right: -12px;
    }
    :deep(.is-icon-close:hover){
        background:none !important;
        color: red !important;
    }
    :deep(.el-tabs__item:hover .is-icon-close){
        width: 14px !important;
    }
    /* .el-tabs{
        --el-text-color-primary:#666;
        --el-border-color-light:#c1c1c1;
    } */
    /* 标签下边框颜色  --el-bg-color */
    :deep(.el-tabs--card>.el-tabs__header .el-tabs__item.is-active) {
        border-bottom-color: #f2f2f2;
    }
</style>