// 封装一个axios请求，通过 Promise和 返回函数
// 导入配置文件
import config from './config'
export default (url,data={},method="GET") =>{
    return new Promise((resolve,reject)=>{
        wx.request({
            url:config.host+url,
            data,
            method,
            success:(res)=>{
               resolve(res.data)
            },
            fail:(err)=>{
                reject(err)
            }
        })
    })
}

