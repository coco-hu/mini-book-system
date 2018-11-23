// miniprogram/pages/index/index.js
const localRequest = require('../../api/localRequest')
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
    this.pullBookInfo()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 拉取更多图书信息
   */
  pullBookInfo : function (keyFlag) {
    const UNIT = 10
    localRequest.searchBook({
      keyFlag: keyFlag,
      key: this.data.searchKey,
      size: UNIT,
      startIndex: this.data.currentIndex
    }).then(res => {
      console.log(res)
      let data =  res && res.list || []
      
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
        content: err.message,
        showCancel: false 
      })
    })

  },
  
  /**
   * 保存搜索框的值
   */
  onInput: function(e){
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
    
    wx.scanCode({
      success: (res) => {
        // wx.navigateTo({
        //   url: `/pages/book/detail/detail?id=W9GwzZL-scb2MQoo`,
        // })
        // return

        let isbn = res.result
        localRequest.searchIsbn({
          isbn: isbn
        }).then(res => {
          console.log(res)
          wx.navigateTo({
            url: `/pages/book/detail/detail?id=${res.id}`,
          })
        }).catch(err => {
          console.log(err)
          wx.navigateTo({
            url: `/pages/book/not-found/not-found`,
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      searchKey: '',
      currentSearchKey: '',
      showLoading: false,
      booklist: [],
      currentIndex: 0,
      hasLoadAll: false
    })

    //默认显示图书信息，每次拉取20条
    this.pullBookInfo()
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