// pages/personal/personal.js
import requests from '../../utils/requests'
let startY = 0 //起始坐标
let moveY = 0 //移动的坐标
let moveDistance = 0 // 移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "translateY(0rpx)", //框的位移
    coverTransition: '', //框的动画
    userinfo: {}, //用户信息
    recentPlayList: []
  },
  handleTouchStart(event) {
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    // 根据移动的距离，动态更新值
    if (moveDistance <= 0) {
      return
    }
    if (moveDistance >= 80) {
      moveDistance = 80
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd(event) {
    //手指松开将位移的值改为0
    this.setData({
      coverTransform: `translateY(0rpx)`,
      coverTransition: 'transform 1s linear'
    })
  },
  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.setData({
        userinfo: JSON.parse(userinfo)
      })
      this.getUserRecentPlayList(this.data.userinfo.userId)
    }
  },
  //获取用户最近听歌的记录
  async getUserRecentPlayList(userId) {
    let recentPlayListRes = await requests('/user/record', {
      type: 0,
      uid: userId
    })
    let index = 0;
    let recentPlayList = recentPlayListRes.allData.map((item) => {
      item.id = index++;
      return item
    })
    this.setData({
      recentPlayList: recentPlayList
    })
    console.log(this.data.recentPlayList);
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