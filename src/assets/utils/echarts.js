// 百度图表 Echarts
import * as echarts from 'echarts/core';
// 引入（标题配置, 提示框, 地图颜色渐变, 分组颜色, 坐标格子）组件Component
import { TitleComponent, TooltipComponent, VisualMapComponent, LegendComponent, GridComponent  } from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'; 
// 引入图表（折线 柱状图 饼状图 地图等..）    
import { MapChart, PieChart, BarChart, LineChart } from 'echarts/charts';

// 注册组件
echarts.use([ 
    TitleComponent, TooltipComponent, VisualMapComponent, LegendComponent, GridComponent,
    LabelLayout, UniversalTransition, 
    CanvasRenderer,
    MapChart, PieChart, BarChart, LineChart  
]);

window.echarts = echarts;   //全局使用