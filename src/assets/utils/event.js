//==================================================================================================================================
// 自定义事件（不相关组件之间通信）
export default {

    /**
     * 发出事件
     * @_name 名称
     * @_params 参数
     */
    $emit( name, params ){
        // CustomEvent 和 Event 区别可以设置 参数（detail固定参数名称）
        let event = new CustomEvent(name, {detail:params}); //创建事件
        document.dispatchEvent(event); //执行事件
    },
    /**
     * 接收事件
     * @_name 名称
     * @_method 方法
     */
    $on( name, method ){
        document.addEventListener(name, method, true); //监听事件 event.detail
    },
    /**
    * 卸载事件
    * @_name 名称
    * @_method 方法
    */
    $off( name, method ){
        document.removeEventListener(name, method, true); //删除 监听事件 
    }

}

//==================================================================================================================================
// 使用 自定义事件

// 在 main.js 生命全局变量
// import Event from './utils/Event'
// app.config.globalProperties.event = Event

// 在 page.vue 使用全局变量
// const { proxy: { event } } = getCurrentInstance();

// event.$emit('SwitchPage', 123); //调用
// event.$on('SwitchPage', SwitchPage); //接收
// function SwitchPage(res){
//     let params = res.detail; //（123）
// }
// onBeforeUnmount(()=>{ //销毁前
//     event.$off('SwitchPage', SwitchPage); //销毁
// })