<template>
    <div id="mx-menu">
        <!-- unique-opened 保持一个子菜单的展开 -->
        <el-menu class="el-menu-vertical-demo" :collapse="MenuFold" :default-active="TabIndex" unique-opened>

            <div class="mx-menu-title" >
                <!-- 系统标题 -->
                <span v-show="!MenuFold" > {{ titleName }} </span>
                <el-icon v-show="MenuFold" > <Promotion /> </el-icon>
            </div>
            
            <template v-for="itme in menuItems" :key="itme.index">
                <el-menu-item class="mx-home" :index="itme.index" v-if="itme.path != null" @click="funMenuSelect(itme)">
                    <el-icon><HomeFilled /></el-icon><template #title>{{itme.name}}</template>
                </el-menu-item>
                <el-sub-menu  :index="itme.index" v-else>
                    <template #title> <el-icon><component :is="itme.icon" /></el-icon> <span>{{itme.name}}</span> </template>
                    <el-menu-item :index="child.index" v-for="child in itme.childs" :key="child.index" @click="funMenuSelect(child)">
                        {{child.name}}
                    </el-menu-item>
                </el-sub-menu>
            </template>
            
        </el-menu>
    </div>
</template>

<script setup>
    import { menuDate } from '@/assets/script/menu-data.js'

    const titleName = document.title;
    const MenuFold = inject('MenuFold');  //菜单折叠
    const TabIndex = inject('TabIndex');
    const TabArray = inject('TabArray');

    const menuItems = shallowRef([]);     //菜单数据
    menuItems.value = menuDate;
    
    setTimeout(()=>{
        let item = menuDate[0];
        item.refresh = true;
        TabArray.value = [item];
        //console.log(TabArray.value); 
        TabIndex.value = item.index;
    }, 1)

    //单击 菜单
    function funMenuSelect(itme){
        itme.refresh = true; //控制页面 刷新 属性
        if(TabArray.value.findIndex(i=> i.index == itme.index) == -1) TabArray.value.push(itme);
        TabIndex.value = itme.index;
    }
</script>

<style scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 220px;
    }
    #mx-menu{
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;

        --el-menu-item-height: 50px;      /* 父菜单高度 */
        --el-menu-sub-item-height: 40px;  /* 子菜单高度 */

        /* --el-menu-bg-color: #20222a; */
        /* --el-menu-bg-color: #28333e; */
        --el-menu-bg-color: #445760;
        --el-menu-hover-bg-color: #434a50;
        --el-menu-text-color:#ffffffcc;
        --el-menu-active-color:#409eff;
    }
    .mx-menu-title{
         /* margin-bottom: 10px; */
        height: var(--mx-header-height);
        /* background-color: var(--mx-header-color); */
        /* background-color: #226a62; */
        font-size: 1.2rem; 
        font-weight: bold;
        /* text-shadow: 2px 2px 2px #afafaf; */
        color: #fff;
        overflow:hidden;      /* 超出的文本隐藏 */
        white-space:nowrap;   /* 溢出不换行 */
        display: flex;
        justify-content:center;
        align-items:center;
    }
    .mx-menu-title:hover{
        cursor: pointer;
        font-size: 1.15rem; 
    }
    .mx-menu-title .el-icon{
        color: var(--el-menu-text-color);
    }
    .el-menu {
        flex: 1;
        border-right: 0;
    }
    /* .el-sub-menu{} */
    /* .el-menu-item{} */
</style>