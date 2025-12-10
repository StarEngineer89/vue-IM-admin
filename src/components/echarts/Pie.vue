<template>
    <div id="chart-pie"></div>
</template>

<script setup>
    import * as echarts from 'echarts/core';
    import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
    import { LabelLayout, UniversalTransition } from 'echarts/features';
    import { CanvasRenderer } from 'echarts/renderers';
    import { PieChart } from 'echarts/charts';
    defineExpose({ Open });

    // 注册组件
    echarts.use([ 
        TitleComponent, TooltipComponent, LegendComponent,
        LabelLayout, UniversalTransition, 
        CanvasRenderer,
        PieChart 
    ]);

    // let pieData = [
    //     { value: 948, name: 'android' },
    //     { value: 735, name: 'ios' },
    //     { value: 580, name: 'pc' }
    // ]

    // 首次加载（页面加载完执行）
    // window.setTimeout(()=>{        
    //     Draw(pieData);
    // },0);

    function Open(data){
        Draw(data);
    }


    // 绘制图表
    function Draw(data){
        let myChart = echarts.init(document.getElementById('chart-pie'));
        myChart.setOption({
            tooltip: { trigger: 'item' },
            legend: { top: '0.1%', left: 'left', orient: 'vertical' }, //分类颜色 vertical竖着
            label: {
                show: true,
                // color:'#56abf9',
                fontSize: '12',
                formatter(param) {
                    return param.name + ' (' + param.percent + '%)';
                }
            },
            series: [{
                // name: 'Access From',
                type: 'pie',
                //roseType: 'area', //面积变动
                //radius: '50%',
                radius: ['40%', '50%'],
                // avoidLabelOverlap: false,
                itemStyle: {  borderRadius: 8  }, //弧度
                // label: { show: false, position: 'center' },
                // emphasis: {
                //     label: {
                //         show: true,
                //         position: "inside", //outside 外部显示  inside 内部显示
                //         formatter: `{d}%`,  //显示百分比
                //         fontSize: '20',
                //         fontWeight: 'bold'
                //     }
                // },
                //labelLine: { show: false },
                data: data
            }],
        });
    }

    // 问题 onMounted(()=>{}) 挂载后 获取不到dmo
    // v-if的初始化结果为false。v-for遍历的数组初始化阶段无值。（即mounted阶段后，根据获得的后台数据来动态操作dom）这两种情况都会导致mounted阶段获取元素的语句获取不到dom
    // 解决方案  window.setTimeout(()=>{ },0); 页面加载完在执行
</script>

<style scoped>
    #chart-pie{
        width: 100%;
        height: 100%;
    }
</style>