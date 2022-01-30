// pages/video/video.js
import requests from '../../utils/requests'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoNavList: [], //视频导航标签列表数据
        navId: null, // 导航的id
        videoList: [], //视频标签下对应的视频数据
        videoId: '', // 视频的id
        timeUpdateList: [], //视频播放信息的数组;[{vid,time}]存储时间和vid
        isRefreshTriggered:false ,//是否刷新被触发
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.reqVideoNavList()
    },
    //该接口用于获取视频导航标签列表数据 /video/group/list
    async reqVideoNavList() {
        let videoNavListRes = await requests('/video/group/list')
        // console.log(videoNavListRes);
        let videoNavList = videoNavListRes.data.slice(0, 20)
        this.setData({
            videoNavList,
            // 默认的显示第一个
            navId: videoNavListRes.data[0].id
        })
        //获取视频标签下对应的视频数据
        this.reqVideoList(this.data.navId)
    },
    // 获取视频标签下对应的视频数据 ! ◼ 需要先登录  发请求需要携带用户cookie

    async reqVideoList(navId) {
        let reqVideoListRes = await requests('/video/group', {
            id: navId
        })
        // console.log(reqVideoListRes);
        // 获取到数据之后,关闭加载框
        wx.hideLoading();
        if (reqVideoListRes.code === 200) {
            // map() 方法创建一个新数组，其结果是该数组中的每个元素是调用一次提供的函数后的返回值。
            let index = 0;
            let videoList = reqVideoListRes.datas.map((item) => {
                item.id = index++;
                return item
            })
            this.setData({
                videoList,
                //设置加载中为false
                isRefreshTriggered:false
            })
        } else {
            wx.showToast({
                title: reqVideoListRes.msg,
                icon: "none"
            })
        }


    },
    // 改变navId事件
    changeNav(e) {
        //通过id属性传递过来的是自动将数字转换成字符串;
        // 如果用全等于 navId == item.id?'active':'' ,需将字符串转换成数字,最简单的方法*1
        // 通过data-key 的方式不进行任何转换
        let navId = e.currentTarget.dataset.id
        this.setData({
            navId: navId,
            // 未获取到数据之前,不显示之前的内容,将视频列表清空
            videoList: []
        })
        wx.showLoading({
            title: '正在加载',
        })
        this.reqVideoList(this.data.navId)
    },
    /**
     * 当开始/继续播放时触发play事件
     * 单个视频播放,需要前一个视频的id和下一个视频的id,
     * 绑定到this上,第一次进来vid没有
     */
    handelPlay(e) {
        // console.log(e);
        //获取视频的vid
        /**先判断this.vid是否存在,然后判断this.videoContext的实例是否存在
         * 单实例模式
         * 1 需要创建多个对象的场景下,通过一个变量去接收,始终保持只有一个对象
         * 2 节省内存空间
         *  */
        let vid = e.currentTarget.id
        // console.log(vid,this.vid);
        // if (this.vid != vid) {
        //     if (this.videoContext) {
        //         this.videoContext.stop()
        //     }
        // }
        // this.vid = vid
        this.setData({
            videoId: vid
        })
        // 创建控制video的实例对象
        this.videoContext = wx.createVideoContext(vid)
        // 这时候需要判断是否有之前的播放记录
        let {timeUpdateList} = this.data;
        // 查找到的数据根据id
        let findItem = timeUpdateList.find(item=> item.vid == vid);
        if(findItem){
            //如果有记录就跳转
            this.videoContext.seek(findItem.currentTime)
        }else{
            this.videoContext.play()
        }
        
    },
    // 处理视频播放时间的时间timeUpdateList中的数据清除一项
    handelEnded(e){
        let {timeUpdateList} = this.data;
        // let id = e.currentTarget.id;
        // // 找到当前视频的id所对应的数组下标
        // let findIndex = timeUpdateList.findIndex(item => item.vid == id)
        // timeUpdateList.splice(findIndex,1);
        // 修改代码
        timeUpdateList.splice(timeUpdateList.findIndex(item => item.vid === e.currentTarget.id))
        this.setData({
            timeUpdateList
        })
    },
    // 视频播放时候的事件
    handelTimeUpdate(e) {
        let vid = e.currentTarget.id;
        let currentTime = e.detail.currentTime;
        let currentTimeObj = {
            vid,
            currentTime
        };
        let {
            timeUpdateList
        } = this.data;
        //查找当前的列表中是否存在该视频的播放信息,如果存在,只需要更新播放的时间即可,否则,需要将数据添加到数组中
        let findItem = timeUpdateList.find(item => item.vid === vid)
        if(findItem){
            findItem.currentTime = currentTime
        }else{
            timeUpdateList.push(currentTimeObj)
        }
        this.setData({
            timeUpdateList
        })
    },
    // 下拉刷新触发的事件
    handelFreshed(){
        this.reqVideoList(this.data.navId)
    },
    // 滚动到底部触发的事件 
    // 拿更多的数据,分页效果
    handelScrollToLower(){
        console.log("上拉触底了");
        console.log("发送新的请求,将新的数据添加到原来的数组中去,但是网易尚未提供该接口");
        // 模拟数据
        let newData = [
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_D45C475DB908E913F2CCC69B3E17E431",
                    "coverUrl": "https://p1.music.126.net/01FDX_Q9s5y5CRZBh7ILgg==/109951163680034995.jpg",
                    "height": 1080,
                    "width": 1920,
                    "title": "不才演唱《化身孤岛的鲸》，完美诠释“孤独”二字",
                    "description": "#国风极乐夜#\n极乐夜，潮国风\n不才完美的声线和这首歌完美契合，不一样的孤独境界！",
                    "commentCount": 759,
                    "shareCount": 862,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 20036903
                        },
                        {
                            "resolution": 480,
                            "size": 36228881
                        },
                        {
                            "resolution": 720,
                            "size": 56947694
                        },
                        {
                            "resolution": 1080,
                            "size": 117033560
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 330000,
                        "authStatus": 1,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/BpzBMB6E2x-h2IvL-xkAtw==/109951164879712373.jpg",
                        "accountStatus": 0,
                        "gender": 2,
                        "city": 330100,
                        "birthday": -2209017600000,
                        "userId": 1651057385,
                        "userType": 10,
                        "nickname": "LOOK直播现场",
                        "signature": "LOOK官方直播间",
                        "description": "网易云音乐LOOK直播官方频道",
                        "detailDescription": "网易云音乐LOOK直播官方频道",
                        "avatarImgId": 109951164879712370,
                        "backgroundImgId": 109951163708728960,
                        "backgroundUrl": "http://p1.music.126.net/lUYJUlMZ49dTHYAKuIZuXw==/109951163708728963.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": null,
                        "djStatus": 0,
                        "vipType": 0,
                        "remarkName": null,
                        "avatarImgIdStr": "109951164879712373",
                        "backgroundImgIdStr": "109951163708728963"
                    },
                    "urlInfo": {
                        "id": "D45C475DB908E913F2CCC69B3E17E431",
                        "url": "http://vodkgeyttp9c.vod.126.net/vodkgeyttp8/gZ4IsHSI_2136067737_uhd.mp4?ts=1642751074&rid=40D6D1E4E0AD2F9D4154D51A51722D7F&rl=3&rs=uLvltJcGYqNRtvLjWYwRnVCQCAFvUpAe&sign=d968c34219f667c1869d83110332d8bf&ext=Ntsw0pKk2fFNsrBDUkONd%2Fkv2f9bdRM1WiavBr0WZL2UbdNpZitFfu2HK%2Fm%2BTTRI%2F9mdqOsqn6FJXf1PKDsE6RfVjI%2FygyJxMqo45lIrLYxutS4Cqa3QcuLB3Yb7i0GE%2B4oghWvkzvkClbmAie%2B7GBRv5u3IsYKHgu689%2F1xpuWm2nyZr2IoT%2Fj1pwSyglYpmaQsKSkSuI4sCzkrNKdFD%2FSg0LM1jwWE0fGMZjwKoRTEeuqTzQBTAPWyUJdaJ3J9",
                        "size": 117033560,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 1080
                    },
                    "videoGroup": [
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": null
                        },
                        {
                            "id": 59101,
                            "name": "华语现场",
                            "alg": null
                        },
                        {
                            "id": 57109,
                            "name": "民谣现场",
                            "alg": null
                        },
                        {
                            "id": 59108,
                            "name": "巡演现场",
                            "alg": null
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "化身孤岛的鲸",
                            "id": 448184048,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 961358,
                                    "name": "不才",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": null,
                            "fee": 0,
                            "v": 18,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 35062876,
                                "name": "翻唱",
                                "picUrl": "http://p3.music.126.net/8EkuWEylV23h2YJVtZ26VA==/109951162826296986.jpg",
                                "tns": [],
                                "pic_str": "109951162826296986",
                                "pic": 109951162826297000
                            },
                            "dt": 279534,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 11192991,
                                "vd": -1100
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 6715812,
                                "vd": 0
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 4477222,
                                "vd": -2
                            },
                            "a": null,
                            "cd": "1",
                            "no": 1,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 2,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 0,
                            "mv": 0,
                            "publishTime": 1482224607140,
                            "privilege": {
                                "id": 448184048,
                                "fee": 0,
                                "payed": 0,
                                "st": 0,
                                "pl": 320000,
                                "dl": 320000,
                                "sp": 7,
                                "cp": 1,
                                "subp": 1,
                                "cs": false,
                                "maxbr": 320000,
                                "fl": 320000,
                                "toast": false,
                                "flag": 256,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "D45C475DB908E913F2CCC69B3E17E431",
                    "durationms": 130282,
                    "playTime": 1296308,
                    "praisedCount": 7635,
                    "praised": false,
                    "subscribed": false
                }
            },
            {
                "type": 1,
                "displayed": false,
                "alg": "onlineHotGroup",
                "extAlg": null,
                "data": {
                    "alg": "onlineHotGroup",
                    "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
                    "threadId": "R_VI_62_39BD89A8B0E0D589DB7949CE28ABBD10",
                    "coverUrl": "https://p1.music.126.net/85ZPtjPfenVsmXOopX57IQ==/109951164808152883.jpg",
                    "height": 720,
                    "width": 1280,
                    "title": "赛琳娜戈麦斯who says经典现场，合唱把傻脸唱哭了",
                    "description": null,
                    "commentCount": 23,
                    "shareCount": 166,
                    "resolutions": [
                        {
                            "resolution": 240,
                            "size": 8262897
                        },
                        {
                            "resolution": 480,
                            "size": 13763231
                        },
                        {
                            "resolution": 720,
                            "size": 19456632
                        }
                    ],
                    "creator": {
                        "defaultAvatar": false,
                        "province": 1000000,
                        "authStatus": 1,
                        "followed": false,
                        "avatarUrl": "http://p1.music.126.net/l3cCHnvwdyh9k0tWtYfqEA==/109951164398468784.jpg",
                        "accountStatus": 0,
                        "gender": 2,
                        "city": 1006800,
                        "birthday": 1568217600000,
                        "userId": 619910086,
                        "userType": 4,
                        "nickname": "Hannah猫姥姥吖",
                        "signature": "Hello my alien / 微博 & b站同名",
                        "description": "",
                        "detailDescription": "",
                        "avatarImgId": 109951164398468780,
                        "backgroundImgId": 109951164399338080,
                        "backgroundUrl": "http://p1.music.126.net/HJqgCBY5mkMftv2082nz4w==/109951164399338082.jpg",
                        "authority": 0,
                        "mutual": false,
                        "expertTags": null,
                        "experts": {
                            "1": "音乐视频达人"
                        },
                        "djStatus": 10,
                        "vipType": 11,
                        "remarkName": null,
                        "avatarImgIdStr": "109951164398468784",
                        "backgroundImgIdStr": "109951164399338082"
                    },
                    "urlInfo": {
                        "id": "39BD89A8B0E0D589DB7949CE28ABBD10",
                        "url": "http://vodkgeyttp9c.vod.126.net/cloudmusic/5mpGyNbE_2940394905_shd.mp4?ts=1642751074&rid=40D6D1E4E0AD2F9D4154D51A51722D7F&rl=3&rs=gfeWImUncziviaJJYjEftshKzFwFQIio&sign=eb5606cd4d7dba7c78c49fdb97421474&ext=Ntsw0pKk2fFNsrBDUkONd%2Fkv2f9bdRM1WiavBr0WZL2UbdNpZitFfu2HK%2Fm%2BTTRI%2F9mdqOsqn6FJXf1PKDsE6RfVjI%2FygyJxMqo45lIrLYxutS4Cqa3QcuLB3Yb7i0GE%2B4oghWvkzvkClbmAie%2B7GBRv5u3IsYKHgu689%2F1xpuWm2nyZr2IoT%2Fj1pwSyglYpmaQsKSkSuI4sCzkrNKdFD%2FSg0LM1jwWE0fGMZjwKoRTEeuqTzQBTAPWyUJdaJ3J9",
                        "size": 19456632,
                        "validityTime": 1200,
                        "needPay": false,
                        "payInfo": null,
                        "r": 720
                    },
                    "videoGroup": [
                        {
                            "id": 58100,
                            "name": "现场",
                            "alg": null
                        },
                        {
                            "id": 57106,
                            "name": "欧美现场",
                            "alg": null
                        },
                        {
                            "id": 57108,
                            "name": "流行现场",
                            "alg": null
                        },
                        {
                            "id": 57110,
                            "name": "饭拍现场",
                            "alg": null
                        },
                        {
                            "id": 1100,
                            "name": "音乐现场",
                            "alg": null
                        },
                        {
                            "id": 5100,
                            "name": "音乐",
                            "alg": null
                        },
                        {
                            "id": 14160,
                            "name": "Selena Gomez",
                            "alg": null
                        }
                    ],
                    "previewUrl": null,
                    "previewDurationms": 0,
                    "hasRelatedGameAd": false,
                    "markTypes": null,
                    "relateSong": [
                        {
                            "name": "Who Says",
                            "id": 29747526,
                            "pst": 0,
                            "t": 0,
                            "ar": [
                                {
                                    "id": 140196,
                                    "name": "Selena Gomez",
                                    "tns": [],
                                    "alias": []
                                }
                            ],
                            "alia": [],
                            "pop": 100,
                            "st": 0,
                            "rt": null,
                            "fee": 1,
                            "v": 40,
                            "crbt": null,
                            "cf": "",
                            "al": {
                                "id": 3065063,
                                "name": "For You",
                                "picUrl": "http://p3.music.126.net/HsVGAjm6Lxr6xaIpH0tCUw==/109951165991288681.jpg",
                                "tns": [],
                                "pic_str": "109951165991288681",
                                "pic": 109951165991288690
                            },
                            "dt": 195000,
                            "h": {
                                "br": 320000,
                                "fid": 0,
                                "size": 7814995,
                                "vd": -39600
                            },
                            "m": {
                                "br": 192000,
                                "fid": 0,
                                "size": 4689078,
                                "vd": -37400
                            },
                            "l": {
                                "br": 128000,
                                "fid": 0,
                                "size": 3126119,
                                "vd": -36100
                            },
                            "a": null,
                            "cd": "1",
                            "no": 5,
                            "rtUrl": null,
                            "ftype": 0,
                            "rtUrls": [],
                            "djId": 0,
                            "copyright": 1,
                            "s_id": 0,
                            "rtype": 0,
                            "rurl": null,
                            "mst": 9,
                            "cp": 7003,
                            "mv": 0,
                            "publishTime": 1416758400000,
                            "privilege": {
                                "id": 29747526,
                                "fee": 1,
                                "payed": 0,
                                "st": 0,
                                "pl": 0,
                                "dl": 0,
                                "sp": 0,
                                "cp": 0,
                                "subp": 0,
                                "cs": false,
                                "maxbr": 320000,
                                "fl": 0,
                                "toast": false,
                                "flag": 4,
                                "preSell": false
                            }
                        }
                    ],
                    "relatedInfo": null,
                    "videoUserLiveInfo": null,
                    "vid": "39BD89A8B0E0D589DB7949CE28ABBD10",
                    "durationms": 90000,
                    "playTime": 100999,
                    "praisedCount": 1434,
                    "praised": false,
                    "subscribed": false
                }
            },
        ]
        let {videoList} = this.data;
        //将最新的数据更新进去
        videoList.push(...newData)
        this.setData({
            videoList
        })
    },
    toSearch(){
        wx.navigateTo({
          url: '/pages/search/search',
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
    onShareAppMessage: function (from) {
        console.log(from);
        // return {
        //     title:'自定义转发内容',
        //     imageUrl:'/static/images/nvsheng.jpg',
        //     // path:'/pages/index/index'
        // }
    }
})