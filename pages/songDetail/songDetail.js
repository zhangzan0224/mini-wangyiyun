// pages/songDetail/songDetail.js
import requests from '../../utils/requests'
import PubSub from 'pubsub-js'
var moment = require('moment');
var appInstance = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //歌曲是否播放,
        musicId: '', //歌曲的id
        songDetail: {},
        musicLink: '', //音乐链接
        currentTime: '00:00', //实时时长
        durationTime: '00:00', //总时长
        currentWidth: 0, //进度条的宽度
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let musicId = options.musicId;
        // console.log(musicId);
        // 如果进来的时候,全局的音乐是在播放,而且也为这首歌曲的id,则改变状态为播放
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            this.setData({
                isPlay: true
            })
        }
        this.setData({
            musicId
        })
        this.getMusicDetail(musicId)
        // 背景音乐控制器,只有一个
        this.backgroundAudioManager = wx.getBackgroundAudioManager()
        //监听背景音乐播放事件
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true)
            appInstance.globalData.musicId = musicId
        })
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        })
        //当音乐被点击停止掉,非正常的关闭
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })
        //监听音乐的实时播放的进度事件
        this.backgroundAudioManager.onTimeUpdate(() => {
            // console.log(this.backgroundAudioManager.currentTime);
            //   number duration
            // 当前音频的长度（单位：s），只有在有合法 src 时返回。（只读）

            // number currentTime
            // 当前音频的播放位置（单位：s），只有在有合法 src 时返回。（只读）


            // 单位是毫秒
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let  currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450
            this.setData({
                currentTime,
                currentWidth
            })
        })
        //监听音乐的播放正常结束的事件
        this.backgroundAudioManager.onEnded(()=>{
            //发送消息,到下一首;
            PubSub.publish('switchType', 'next');
            //将进度条归位0,时间也改为0
            this.setData({
                currentWidth:0,
                currentTime: '00:00', //实时时长
            })
        })
    },
    // 修改音乐播放状态功能函数
    changePlayState(isPlay) {
        this.setData({
            isPlay
        })
        appInstance.globalData.isMusicPlay = isPlay
    },
    //点击播放和暂停的回调函数
    handleMusicPlay() {
        let isPlay = !this.data.isPlay;
        let {
            musicId,
            musicLink
        } = this.data
        //修改状态,改到了监听音乐播放事件
        // this.setData({
        //     isPlay
        // })
        this.musicControl(isPlay, musicId, musicLink)
    },
    // 控制音乐播放和暂停的功能函数
    async musicControl(isPlay, musicId, musicLink) {
        if (isPlay) { //音乐播放
            //减少发请求的次数
            if (!musicLink) {
                let reqMusicUrl = await requests('/song/url', {
                    id: musicId
                })
                // console.log(reqMusicUrl);
                let musicLink = reqMusicUrl.data[0].url;
                this.setData({
                    musicLink
                })
                if (reqMusicUrl.code === 200) {
                    this.backgroundAudioManager.src = musicLink
                    //音频标题，用于原生音频播放器音频标题（必填）。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。
                    this.backgroundAudioManager.title = this.data.songDetail.name
                }
            } else {
                this.backgroundAudioManager.src = musicLink;
                //音频标题，用于原生音频播放器音频标题（必填）。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。
                this.backgroundAudioManager.title = this.data.songDetail.name;
            }


        } else { //音乐暂停
            this.backgroundAudioManager.pause()
        }
    },
    // 获取音乐的详情
    async getMusicDetail(musicId) {
        let reqMusicDetailRes = await requests('/song/detail', {
            ids: musicId
        })

        // console.log(reqMusicDetailRes);
        if (reqMusicDetailRes.code === 200) {
            let durationTime = moment(reqMusicDetailRes.songs[0].dt).format('mm:ss')
            this.setData({
                songDetail: reqMusicDetailRes.songs[0],
                durationTime
            })
        }
        // 获取到信息后,动态修改navigationBarTitleText
        wx.setNavigationBarTitle({
            title: this.data.songDetail.name,
        })
    },
    // 上一首下一首
    handleSwitch(e) {
        // 首先关闭上一首的音乐
        this.backgroundAudioManager.stop();
        // 发布事件获取musicId
        //订阅消息key的值是musicId,value是回调函数,每次点击都会增加一个回调函数,所以要取消订阅,但是每次点击都会订阅
        PubSub.subscribe('musicId', (msg, musicId) => {
            // console.log(musicId);
            this.setData({
                musicId
            })
            //获取音乐的信息
            this.getMusicDetail(musicId);
            // 然后自动播放
            this.musicControl(true, musicId)
            // 取消订阅,要不每次点击上一首下一首, 都会往musicIdde下添加一个回调函数
            PubSub.unsubscribe('musicId')
        })
        //确定上一首还是下一首
        let switchType = e.currentTarget.id;
        PubSub.publish('switchType', switchType)
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