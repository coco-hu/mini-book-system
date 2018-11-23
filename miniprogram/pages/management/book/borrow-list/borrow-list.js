// miniprogram/pages/management/book/borrow-list/borrow-list.js
const myRequest = require('../../../../api/myRequest')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: []
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
    this.getBorrowList()
  },

  /**
   * 拉取逾期列表
   */
  getBorrowList: function () {
    let _self = this

    wx.showLoading()
    myRequest.call('book', {
      $url: "all-borrow-list",
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      _self.setData({
        booklist: res.list,
        booklistLength: res.list.length
      })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
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
  }

})