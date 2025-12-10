export function ImageBase64(file) {
    return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            // 成功
            resolve( reader.result );
        };
        reader.onerror = function(error) {
            // 出错
            reject(error);
        };
    });
}

//--------------------------------------------------------------------------------------------FileReader 的事件
// onloadstart	读取开始时触发
// onprogress	读取中（读取过程中周期性触发 可用用于实现进度条）
// onload	    文件读取成功完成时触发
// onerror	    出错时触发
// onabort	    中断时触发
// onloadend	读取完成触发，无论成功或失败
//--------------------------------------------------------------------------------------------FileReader 的方法
// readAsDataURL()      读取文件并且将文件以数据URI的形式保存在result属性中。
// readAsBinaryString() 读取文件并且把文件以字符串保存在result属性中。
// readAsText()         以纯文本形式读取文件 读取到的文本保存在result属性中。
// readAsArrayBuffer()  读取文件并且将一个包含文件内容的ArrayBuffer保存咋result属性中。
// abort()              可用于中止读取