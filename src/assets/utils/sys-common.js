import { isDark } from '@/store'

if(isDark.value) document.documentElement.classList.add("dark");

/** 切换全屏 */
export function ToggleFullscreen(){
    //fullscreenElement W3C, msFullscreenElement IE, mozFullScreenElement 火狐， webkitFullscreenElement 谷歌
    let isFull =  ( document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement ) ? true : false;
    if( isFull ){
        let element = document;
        let method = element.cancelFullScreen || element.webkitCancelFullScreen || element.mozCancelFullScreen || element.exitFullScreen;
        if(method)  method.call(element);
    }
    else{
        let element = document.documentElement;
        let method = element.requestFullScreen ||  element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;
        if(method)  method.call(element);
    }
}

/** 深色过度动画（此方法要配合过度样式） */
export const ToggleDark = event =>{
    //（新增的视图过度API）不支持此 API 的浏览器 执行方案：
    if (!document.startViewTransition) {
        document.documentElement.classList.toggle("dark");
        isDark.value? isDark.value=false: isDark.value=true;
        return;
    }
    // 获取点击位置
    const x = event.clientX;
    const y = event.clientY;
    // 获取到最远角的距离
    const endRadius = Math.hypot( 
        Math.max(x, innerWidth - x), 
        Math.max(y, innerHeight - y)
    );
    // 定义css：剪切属性 clip-path
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];
    // 开始视图过渡：
    const transition = document.startViewTransition(() => {
        document.documentElement.classList.toggle("dark");
        isDark.value? isDark.value=false: isDark.value=true;
    });
    // 等待伪元素创建完成：
    transition.ready.then(() => {
        //开始动画（元素动画）
        document.documentElement.animate(
            { clipPath: isDark.value ? [...clipPath].reverse() : clipPath },
            {
                duration: 500,  //时间
                easing: "linear", //匀速
                pseudoElement: isDark.value ? "::view-transition-old(root)" : "::view-transition-new(root)"  // 指定要附加动画的元素
            }
        );
    })
}