// pages/search/search.js
import requests from '../../utils/requests'
let isSend = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent: '', //初始化搜索框的placeholader
        hotList: [], //热搜榜
        searchContent: '', //搜索的词
        searchList: [], //模糊匹配的列表
        searchHistoryList: [], //历史搜索记录
    },
    // 获取初始化数据
    async getInitData() {
        let placeholderData = await requests('/search/default');
        let reqHotListRes = await requests('/search/hot/detail');
        // console.log(reqHotListRes);
        this.setData({
            placeholderContent: placeholderData.data.showKeyword,
            hotList: reqHotListRes.data
        })
    },
    //输入框输入事件
    handleInputChange(e) {
        this.setData({
            searchContent: e.detail.value.trim()
        })
        // 第一次进来可以发送请求
        if (isSend) {
            return
        }
        isSend = true
        //发送请求获取数据
        if (this.data.searchContent != '') {
            setTimeout(async () => {
                this.reqSearchList();
                // 将isSend重置为false;300毫秒之后才可以继续发请求
                isSend = false
            }, 500);
        }


    },
    //获取搜索数据的功能函数
    async reqSearchList() {
        if (!this.data.searchContent) {
            this.setData({
                searchList: []
            })
            return
        }
        let reqSearchListRes = await requests('/search', {
            keywords: this.data.searchContent,
            limit: 10
        });
        let {
            searchContent,
            searchHistoryList
        } = this.data;
        // 当发送完请求后将搜索的关键字存放到搜索历史中
        // 判断是否之前搜索过  //将最新搜索的,之前的删除,然后添加一个新的;
        if (searchHistoryList.indexOf(searchContent) != -1) {
            searchHistoryList.splice(searchHistoryList.indexOf(searchContent), 1)
        }
        searchHistoryList.unshift(searchContent);

        this.setData({
            searchHistoryList,
            searchList: reqSearchListRes.result.songs
        })
        wx.setStorageSync('history', searchHistoryList)
    },
    // 获取历史记录
    getSearchList() {
        let searchHistoryList = wx.getStorageSync('history')
        if (searchHistoryList) {
            this.setData({
                searchHistoryList
            })
        }
    },
    // 清空搜索的内容
    clearSearchContent() {
        this.setData({
            searchContent: '',
            searchList: []
        })
    },
    //移除历史搜索记录
    deleteSearchHistoryList() {
        wx.showModal({
            content: '确认清空历史记录吗',
            success: (res) => {
                if (res.confirm) {
                    //清空记录
                    this.setData({
                        searchHistoryList: []
                    })
                    //移除本地存储的
                    wx.removeStorageSync('history')
                }
            }
        })

    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getInitData()
        this.getSearchList()
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