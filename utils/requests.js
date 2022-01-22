// 封装一个axios请求，通过 Promise和 返回函数
// 导入配置文件
import config from './config'
export default (url,data={},method="GET") =>{
    return new Promise((resolve,reject)=>{
        wx.request({
            url:config.host+url,
            data,
            // 请求头添加cookie字段 ,拿musicU的
            // 未登录,没有cookie字段,这时候会报错,空的find是没有,所以需判断
            header:{'cookie':wx.getStorageSync('cookie')?wx.getStorageSync('cookie').find((item)=> item.indexOf('MUSIC_U') != -1):''},
            method,
            success:(res)=>{
                // console.log(res);
                if(data.isLogin){
                    wx.setStorage({
                        key:'cookie',
                        data:res.cookies
                    })
                }
               resolve(res.data)
            },
            fail:(err)=>{
                reject(err)
            }
        })
    })
}

