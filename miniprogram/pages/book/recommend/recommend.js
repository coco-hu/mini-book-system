// miniprogram/pages/book/recommend/recommend.js

const myRequest = require('../../../api/myRequest')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [],
    booklistLength: '',
    currentIndex: 0,
    hasLoadAll: false,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      booklist: [],
      booklistLength: '',
      currentIndex: 0,
      hasLoadAll: false,
    })
    wx.showLoading()
    this.getRecommendList();
  },

  /**
   * 获取推荐列表
   */
  getRecommendList: function () {
    const UNIT = 100
    let _self = this
    let userId = wx.getStorageSync('userId')

    this.setData({
      showLoading: true
    })
    myRequest.call('book', {
      $url: "recommend-list",
      size: UNIT,
      startIndex: this.data.currentIndex,
      userId: userId,
    }).then(res => {
      console.log(res)
      wx.hideLoading()

      let data = res && res.list || []
      let booklist = this.data.booklist.concat(data)

      _self.setData({
        showLoading: false,
        booklist: booklist,
        booklistLength: booklist.length,
        currentIndex: this.data.currentIndex + UNIT
      })
      if (!data || data.length < UNIT) {
        this.setData({
          hasLoadAll: true
        })
      }
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
      if (!app.checkLogin(err.code)) {
        return
      }
      _self.setData({
        booklistLength: 0
      })
      wx.showModal({
        content: err.message,
        showCancel: false 
      })
    })

  },

  /**
   * 添加推荐
   */
  toRecommend: function() {
    wx.navigateTo({
      url: '/pages/management/book/edit/edit?type=recommend',
    })
  },

  /**
   * 去详情页
   */
  toDetail: function (e) {
    wx.navigateTo({
      url: `/pages/book/detail/detail?id=${e.currentTarget.id}`,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasLoadAll) {
      return false
    }

    this.getBooklist()
  }
  
})