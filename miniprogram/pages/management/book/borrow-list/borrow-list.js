// miniprogram/pages/management/book/borrow-list/borrow-list.js
const myRequest = require('../../../../api/myRequest')
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getBorrowList()
  },

  /**
   * 拉取逾期列表
   */
  getBorrowList: function () {
    const UNIT = 100
    let _self = this

    this.setData({
      showLoading: true
    })
    myRequest.call('book', {
      $url: "all-borrow-list",
      size: UNIT,
      startIndex: this.data.currentIndex
    }).then(res => {
      console.log(res)

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
      _self.setData({
        booklist: [],
        booklistLength: 0
      })
      if (!app.checkLogin(err.code)) {
        return
      }
      wx.showModal({
        content: err.message,
        showCancel: false
      })
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