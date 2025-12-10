
export function ImgZip(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file.raw);
        reader.onload = ()=>{
            let base64 = reader.result;
            if(file.size > 1000000){
                let ratio = 1000000 / file.size; //计算压缩比
                let image = new Image(); //创建图片对象
                image.src = base64;
                image.onload = () => {
                    base64 = compress(image, ratio.toFixed(2));
                    resolve(base64);
                };
            }
            else resolve(base64);
        }
        reader.onerror = function(error) {
            //转失败
            reject(error); 
        };
    });
}
/**
 * 压缩
 * @_image 图片对象
 * @_ratio 压缩比（值 0.1 ~ 1）
 */
function compress (image, ratio) {
    let canvas, base64;
    canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
    base64 = canvas.toDataURL('image/jpeg', ratio);
    return base64;
}