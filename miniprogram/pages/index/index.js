// miniprogram/pages/index/index.js
const myRequest = require('../../api/myRequest')

const app = getApp()
 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    searchKey: '',
    currentSearchKey: '',
    hasLoadAll: false,
    showLoading: false,
    booklist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!wx.cloud){
      wx.redirectTo({
        url: '../chooseLib/chooseLib'
      })
      return
    }

    //默认显示图书信息，每次拉取20条
    this.pullBookInfo()
  },

  /**
   * 拉取更多图书信息
   */
  pullBookInfo : function (keyFlag) {
    const UNIT = 10
    myRequest.call('book', {
      $url: "search",
      keyFlag: keyFlag,
      key: this.data.searchKey,
      size: UNIT,
      startIndex: this.data.currentIndex
    }).then(res => {
      console.log(res)
      let data =  res.list || []
      this.setData({
        showLoading: false,
        booklist: this.data.booklist.concat(data),
        currentIndex: this.data.currentIndex + UNIT
      })
      if (!data || data.length < UNIT) {
        this.setData({
          hasLoadAll: true
        })
      }
    }).catch(err => {
      console.log(err)
      this.setData({
        showLoading: true
      })
      wx.showModal({
        content: '无法拉取图书信息',
      })
    })

  },
  
  /**
   * 保存搜索框的值
   */
  searchBlur: function(e){
    this.setData({
      currentSearchKey: e.detail.value
    })
  },

  /**
   * 搜索图书
   */
  search: function (e) {
    let key
    if(e.currentTarget.id === 'search'){
      key = e.detail.value
    }else{
      key = this.data.currentSearchKey
    }
    this.setData({
      searchKey: key,
      currentIndex: 0,
      booklist: [],
      hasLoadAll: false
    })
    this.pullBookInfo(this.data.searchKey)
  },

  /**
   * 去书籍详情页
   */
  toBookDetail: function (e) {
    wx.navigateTo({
      url: `/pages/book/detail/detail?id=${e.currentTarget.id}`,
    })
  },

  /**
   * 扫码识别
   */
  doScan: function () {
    // wx.navigateTo({
    //   url: `/pages/book/detail/detail?id=W9GwzZL-scb2MQoo`,
    // })
    // return
    wx.scanCode({
      success: (res) => {
        myRequest.call('book', {
          $url: "search-isbn",
          isbn: res.result
        }).then(res => {
          console.log(res)
          wx.navigateTo({
            url: `/pages/book/detail/detail?id=${res.id}`,
          })
        }).catch(err => {
          console.log(err)
          wx.showModal({
            content: err && err.message
          })
        })
      },
      fail: (err) => {
        wx.showToast({
          title: err
        })
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.hasLoadAll){
      return false
    }
    this.setData({
      showLoading: true
    })
    this.pullBookInfo()
  }
})