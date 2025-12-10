import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'

export default {
    /**
     * @param message 内容
     * @param duration 显示时间，单位为毫秒。 设为 0 则不会自动关闭
     * @param onClose 回调
    */
	success:function(message, duration, onClose){
        Messages('success', message, duration, onClose);
    },
    warning:function(message, duration){
        Messages('warning', message, duration);
    },
    error:function(message, duration){
        Messages('error', message, duration);
    },
    /**
     * @param title 标题
     * @param text 文本
     * @param onConfirm 确认回调
    */
    confirm: function(title, text, onConfirm){
        MessageBoxConfirm(text, title, onConfirm);
    },
    loading: function(text){
        return ElLoading.service({ lock: true, text: text, background: 'rgba(0, 0, 0, 0.1)' });
    }
}

//提示消息
function Messages(type, message, duration, onClose){
    ElMessage.closeAll();
    ElMessage({
        type: type,
        message: message,
        showClose: true,
        duration: duration,
        onClose: onClose
    });
}
//确认消息
function MessageBoxConfirm(text, title, onConfirm){
    ElMessageBox.confirm( 
        text,
        title,
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }
    ).then(onConfirm).catch(() => {});
}