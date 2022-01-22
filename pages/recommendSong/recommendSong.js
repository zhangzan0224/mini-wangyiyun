// pages/recommendSong/recommendSong.js
import requests from '../../utils/requests'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:'',
        mouth:'',
        recommendSongList:[]
    },
   async getRecommendSongList(){
        let reqRecommendSongListRes =await requests('/recommend/songs')
        // console.log(reqRecommendSongList);
        if(reqRecommendSongListRes.code === 200){
            this.setData({
                recommendSongList:reqRecommendSongListRes.data.dailySongs
            })
        }
    },
    //跳转到歌曲详情页
    gotoSongDetail(e){
        let musicId = e.currentTarget.dataset.id;
        wx.navigateTo({
          url: '/pages/songDetail/songDetail?musicId='+musicId,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getRecommendSongList()
        //更新日期的状态数据
        this.setData({
            day:new Date().getDate(),
            mouth:new Date().getMonth()+1
        })
        // 判断用户是否登录
        let userInfo = wx.getStorageSync('userinfo')
        if(!userInfo){
            wx.showToast({
              title: '请先登录',
              icon:'none',
              success:()=>{
                  //跳转到登录页面
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
              }
            })
        }
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