// miniprogram/pages/book/h-list/h-list.js

const utils = require('../../../utils/utils')
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
    pageType: 'current'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageType: options.type
    })
    wx.setNavigationBarTitle({
      title: options.type === "current"? '当前借阅' : '历史借阅'
    })
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
   * 获取统计信息
   */
  getBorrowList: function () {
    const UNIT = 100
    let _self = this
    let _type = this.data.pageType
    let userId = wx.getStorageSync('userId')

    this.setData({
      showLoading: true
    })
    myRequest.call('book', {
      $url: "borrow-list",
      size: UNIT,
      startIndex: this.data.currentIndex,
      userId: userId,
      status: _type === 'current' ? 0 : 1
    }).then(res => {
      console.log('===', res)
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
   * 续借
   */
  reRent: function (e) {
    let _self = this
    let index = e.currentTarget.id
    let item = this.data.booklist[index]
    let eTime = utils.getExpireTime(item.expire_time, 30)
    let eDate = utils.formatTime(eTime, 'Y-M-D')
    wx.showModal({
      title: '提示',
      content: '确定要续借这本吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading()
          myRequest.call('book', {
            $url: "renew",
            id: item._id,
            expire_date: eDate,
            expire_time: eTime
          }).then(res => {
            console.log(res)
            wx.hideLoading()
            _self.onShow()
          }).catch(err => {
            console.log(err)
            wx.hideLoading()
            if (!app.checkLogin(err.code)) {
              return
            }
            wx.showModal({
              content: err.message,
              showCancel: false 
            })
          })
        }
      }
    })
  },

  /**
   * 归还
   */
  retBook: function (e) {
    let _self = this
    let index = e.currentTarget.id
    let item = this.data.booklist[index]
    let eTime = new Date().getTime()/1000
    let eDate = utils.formatTime(eTime, 'Y-M-D')

    wx.showModal({
      title: '提示',
      content: '确定归还',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading()
          myRequest.call('book', {
            $url: "return",
            borrowId: item._id,
            bookId: item.bookId,
            end_date: eDate,
            end_time: eTime,
          }).then(res => {
            console.log(res)
            wx.hideLoading()
            _self.onShow()
          }).catch(err => {
            console.log(err)
            wx.hideLoading()
            if (!app.checkLogin(err.code)) {
              return
            }
            wx.showModal({
              content: err.message,
              showCancel: false 
            })
          })
        }
      }
    })
  },

  /**
   * 去图书详情页
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