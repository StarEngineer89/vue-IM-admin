<template>
    <el-container>
        <el-aside > <Menu></Menu> </el-aside>
        <el-container>
            <el-header> <Header></Header> </el-header>
            <el-main>  <Main></Main> </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
    import Menu from '@/components/index/menu.vue'
    import Header from '@/components/index/header.vue'
    import Main from '@/components/index/main.vue'
    //import '@/assets/utils/echarts';

    provide('MenuFold', ref(false)); //菜单折叠
    provide('TabIndex', ref(''));
    provide('TabArray', ref([]));
</script>
  
<style scoped>
    .el-container{
        height: 100%;
    }
    .el-aside{
        width: auto;
    }
    .el-header{
        height: auto;
    }
    .el-header, .el-main, .el-footer{
        padding: 0;
    }
</style>