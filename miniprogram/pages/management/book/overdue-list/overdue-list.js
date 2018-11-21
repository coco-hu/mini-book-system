// miniprogram/pages/management/book/overdue-list/overdue-list.js

const myRequest = require('../../../../api/myRequest')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: []
  },

  remind: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要发送提醒吗？',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getOverList()
  },

  /**
   * 拉取逾期列表
   */
  getOverList: function() {
    let _self = this

    wx.showLoading()
    myRequest.call('book', {
      $url: "overdue-list",
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
        content: '拉取数据失败',
      })
    })
  }
  
})