<template>
    <div id="chart-map"></div>
</template>

<script setup>
    import * as echarts from 'echarts/core';
    import { TitleComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
    import { LabelLayout, UniversalTransition } from 'echarts/features';
    import { CanvasRenderer } from 'echarts/renderers';
    import { MapChart } from 'echarts/charts';
    import China from '@/assets/library/中国省份简称.json';

    const emit = defineEmits(['query']); //emit('query'); 
    defineExpose({ Open });

    // 注册组件
    echarts.use([ 
        TitleComponent, TooltipComponent, VisualMapComponent,
        LabelLayout, UniversalTransition, 
        CanvasRenderer,
        MapChart 
    ]);
    
    //首次加载（页面加载完执行）
    // window.setTimeout(()=>{        
    //     echarts.registerMap('china', China); // 注册地图
    //     Draw(mapData);
    //     // 这其中比较有意思的是，如果你注册地图时，还有option.geo.map的名字用的是china，南海诸岛会如上图以缩略图展示，但是以此之外来命名地图，则不会展示缩略图
    // },0);

    function Open(data){
        echarts.registerMap('china', China); // 注册地图
        Draw(data);
    }

    // 绘制图表
    let myChart = null;
    let cZoom = 1.2;
    function Draw(array){
        myChart = null;
        myChart = echarts.init(document.getElementById('chart-map'));
        myChart.setOption({
            tooltip: {
                //提示框
                //show: false,//默认显示
                showDelay: 0,                 //显示延迟
                transitionDuration: 0.2,      //过度时间
                textStyle:{ color:'#fff' },   //字体样式
                backgroundColor: 'rgba(50,50,50,0.9)',   // 提示背景颜色，默认为透明度为0.7的黑色
            },
            visualMap: {
                orient: 'horizontal', 
                min: 0,
                max: Math.max.apply(Math, array.map((item)=>{ return item.value; })),
                //color: ['rgba(0,85,123,0.8)','rgba(0,85,123,0.4)'],
                color: ['#011c39','#006895'],
                text: ['高','低'],
                textStyle:{ color:'#006895' }
            },
            series: {
                name: '整改率',
                zoom: cZoom,    //地图初始比例
                //type: 'map3D',
                type: 'map',
                //roam: true, //鼠标可以放大放小 可以拖动
                map: 'china',
                label:{
                    show: true,      //显示地域名称 默认false
                    color: '#54e2fd' //名称颜色
                },    
                emphasis:{
                    itemStyle:{
                        // borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.5);', //边界线颜色
                        areaColor: '#33bff0', //鼠标(滑过)区域颜色 设置为空字符串可使颜色不变
                        //color:'rgba(43,161,202,0.6)'
                        //color: '#33bff0'
                    },
                    label: {
                        color: '#fff' //鼠标滑过区域 文字 颜色
                    }
                },
                // viewControl: {
                //     center: [7, -6, 10],
                // },
                select:false,
                itemStyle:{ 
                    borderWidth: 0.5,       //边际线大小
                    borderColor: '#33bff0', //边界线颜色
                    //areaColor: '#f2f2f2'  //默认区域颜色
                }, 
                data: array
            },
            geo:{
                zoom: cZoom,
                type: 'map',
                roam: false,
                map: 'china',
                // left: '20px',
                // top: 'bottom',
                itemStyle:{ 
                    //areaColor: '地图颜色',
                    shadowColor: '#33bff0', //阴影 颜色
                    shadowBlur: 10,     //虚化度
                    opacity:0.9,        //透明度
                    shadowOffsetX: 5,   //偏移
                    shadowOffsetY: 10
                }, 
            }
        });

        // myChart.on('mouseover', function (params) { })
        // myChart.on('mouseout', function () { })
        // myChart.on('click', function (params) { })
    }

    // 调整图表大小
    function Resize(){
        if(myChart)  myChart.resize();
    }


    let mapData = [
        {name:'西藏', value:60},
        {name:'青海', value:167},
        {name:'宁夏', value:210},
        {name:'海南', value:252},
        {name:'甘肃', value:502},
        {name:'贵州', value:570},
        {name:'新疆', value:661},
        {name:'云南', value:8890},
        {name:'重庆', value:10010},
        {name:'吉林', value:5056},
        {name:'山西', value:2123},
        {name:'天津', value:9130},
        {name:'江西', value:10170},
        {name:'广西', value:6172},
        {name:'陕西', value:9251},
        {name:'黑龙江', value:5125},
        {name:'内蒙古', value:1435},
        {name:'安徽', value:9530},
        {name:'北京', value:51919},
        {name:'福建', value:3756},
        {name:'上海', value:59190},
        {name:'湖北', value:37109},
        {name:'湖南', value:8966},
        {name:'四川', value:31020},
        {name:'辽宁', value:7222},
        {name:'河北', value:3451},
        {name:'河南', value:9693},
        {name:'浙江', value:62310},
        {name:'山东', value:39231},
        {name:'江苏', value:35911},
        {name:'广东', value:55891}
    ]
</script>

<style scoped>
    #chart-map{
        width: 100%;
        height: 100%;
    }
</style>