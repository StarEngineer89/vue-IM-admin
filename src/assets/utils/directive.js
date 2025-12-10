//自定义指令
export default {
    install: app => {
        // Element按钮去焦
        app.directive('blur', {
            mounted(element) {
                element.addEventListener('mouseup', OnBlur);
            },
            unmounted(element) {
                element.removeEventListener('mouseup', OnBlur);
            }
        })
        // 秒定时器
        app.directive('second', {
            mounted(element, callback) {
                OnSecond(callback);
            },
            unmounted(element) {
                SecondFun = null;
            }
        })
        // 监听元素 大小 变化
        app.directive('resize', (element, callback) => {
            OnResize(element, callback);
        })
    }
}

/** 移除焦点 */
function OnBlur(evt) {
    let target = evt.target;
    if (target.nodeName == 'SPAN') {
        target = evt.target.parentNode;
    }
    target.blur();
}

/** 秒定时器 */
let startTime = performance.now();
function OnSecond(callback){
    SecondFun = async ()=>{
        if( performance.now() - startTime >= 1000 ){
            callback.value();
            startTime = performance.now();
        }
    }
}

/** 监听元素 大小 变化 */
function OnResize(element, callback){
    let width = element.clientWidth;
    let height = element.clientHeight;
    ResizeFun = async ()=>{
        if( width != element.clientWidth || height != element.clientHeight ){
            width = element.clientWidth;
            height = element.clientHeight;
            await callback.value();
        }
    };
}

let SecondFun = null; //秒定时器 回调
let ResizeFun = null; //监听元素 回调
/** 脚本动画 */
function Animation(){
    if( SecondFun ) SecondFun();
    if( ResizeFun ) ResizeFun();
    window.requestAnimationFrame(Animation);
}
Animation();