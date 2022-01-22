// pages/songDetail/songDetail.js
import requests from '../../utils/requests'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //歌曲是否播放,
        ids: '', //歌曲的id
        songDetail: {}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options);
        let musicId = options.musicId;
        this.setData({
            ids: musicId
        })
        this.getMusicDetail(musicId)
    },
    //点击播放和暂停的回调函数
    handleMusicPlay() {
        let isPlay = !this.data.isPlay;
        this.setData({
            isPlay
        })
        this.musicControl()
    },
    // 控制音乐播放和暂停的功能函数
    musicControl(isPlay){
        if(isPlay){//音乐播放
            
        }else{//音乐暂停
            
        }
    },
    // 获取音乐的详情
    async getMusicDetail(ids) {
        let reqMusicDetailRes = await requests('/song/detail', {
            ids
        })
        // console.log(reqMusicDetailRes);
        if (reqMusicDetailRes.code === 200) {
            this.setData({
                songDetail: reqMusicDetailRes.songs[0]
            })
        }
        // 获取到信息后,动态修改navigationBarTitleText
        wx.setNavigationBarTitle({
          title: this.data.songDetail.name,
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