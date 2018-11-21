// miniprogram/pages/book/not-found/not-found.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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

  },

  /**
   * 返回首页
   */
  goIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})