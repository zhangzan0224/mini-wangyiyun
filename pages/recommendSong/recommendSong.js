import PubSub from 'pubsub-js'
import requests from '../../utils/requests'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day:'',
        mouth:'',
        recommendSongList:[],
        index:0 //歌曲的下标
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
        let {musicid , index} = e.currentTarget.dataset;
        this.setData({
            index
        })
        wx.navigateTo({
            //注意dataset的获取的key值都是小写
          url: '/pages/songDetail/songDetail?musicId='+musicid,
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
        // 订阅消息,订阅来自songDetail的消息
        PubSub.subscribe('switchType',(msg,type)=>{
            let {recommendSongList , index} = this.data
            // console.log(msg,type);
            if(type == 'pre'){
                // 当到第一首的时候下次点击上一首跳到最后一首
                (index === 0) && (index = recommendSongList.length)
                index = index-1;
            }else{
                // 当到第一首的时候下次点击上一首跳到最后一首
                (index ==recommendSongList.length - 1 ) && (index = -1)
                index = index+1;
            }
            // 更新下标

            this.setData({
                index
            })
            let musicId = recommendSongList[index].id;
            PubSub.publish('musicId',musicId)
        })
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