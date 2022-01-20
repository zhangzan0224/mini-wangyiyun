// pages/index/index.js
import requests from '../../utils/requests'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList:[] ,//轮播图
        recommentList:[], // 推荐歌单
        topList:[] // 排行榜数据
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:async function (options) {
        let bannerRes = await requests('/banner',{type:2})
        if(bannerRes.code === 200){
            this.setData({
                bannerList:bannerRes.banners
            })
        }
        //获取歌单数据
        let recommendRes = await requests('/personalized',{limit:20})
        console.log(recommendRes);
        if(recommendRes.code === 200){
            this.setData({
                recommentList:recommendRes.result
            })
        }
        // 获取热歌榜
        /**
         * 需求分析：
         * 1：需要根据idx的值获取相应的数据
         * 2：idx的取值范围是0-20,我们需要0-4
         * 3：需要发五次请求
         * 4:前++和后++的区别
         */
        let index = 0 ;
        let resultArr = [];
        while(index < 5){
            let topListRes = await requests('/top/list',{idx:index++})
            // splice （修改原数组，可以对制定的数据进行增删改）
            // slice(不会修改原数组)
            let topListItem = {name:topListRes.playlist.name,tracks:topListRes.playlist.tracks.slice(0,3)}
            resultArr.push(topListItem)
            // 不需要等待五次请求全部结束才更新
            this.setData({
                topList:resultArr
            })
        }
        // 更新topList ，放在此处更新的话，会导致发送请求的过程，导致页面长时间白屏，用户体验差
        // this.setData({
        //     topList:resultArr
        // })
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