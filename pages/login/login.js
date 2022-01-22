// pages/login/login.js
/**
 * 登录流程
 * 1，收集表单数据
 * 2，前端验证
 *  1）验证账号密码是否合法
 *  2）前端验证不通过就提示用户，不需要发请求给后端
 *  3）前端通过了，发请求，携带账号密码给服务端
 * 3，后端验证
 *  1）验证用户是否存在
 *  2）不存在直接返回，告诉前端用户不存在，
 *  3）用户存在需要验证密码是否正确
 *  4）密码不正确，返回前端，提示密码不正确，
 *  5）密码正确，返回前端数据，提示用户登录成功，携带用户的相关信息。
 */
import requests from '../../utils/requests'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '', //手机号码
    password: '' //密码
  },
  //表单输入的事件 
  handelInput(e) {
    // currentTarget要求绑定的元素一定是触发事件的元素
    // target 绑定事件的元素不一定是触发事件的元素
    // 也可以使用dataset进行传值
    let type = e.currentTarget.id
    this.setData({
      [type]: e.detail.value
    })

  },
  // 登录事件
  async login() {
    //获取表单数据
    let {
      phone,
      password
    } = this.data;
    /**
     * 手机号不为空
     * 手机号符合规则
     */
    if (!phone) {
      //提示用户
      wx.showToast({
        title: '手机号不为空',
        icon: 'none'
      })
      return
    }
    const regMebile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
    if (!regMebile.test(phone)) {
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none'
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    let result = await requests('/login/cellphone',{phone,password,isLogin:true})
    if(result.code == 200){
      wx.showToast({
        title: '成功登录'
      })
      // 跳转至个人中心
      // 使用switchTab
      // reLaunch()关闭所以页面,重新打开url的页面
      console.log(result);
      wx.setStorageSync('userinfo',JSON.stringify(result.profile))
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if ( result.code == 400){
      wx.showToast({
        title: '手机号错误',
        icon:'none'
      })
    }else if ( result.code == 502){
      wx.showToast({
        title: '密码错误',
        icon:'none'
      })
    }else{
      wx.showToast({
        title: '登录失败,请重新登录',
        icon:'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})