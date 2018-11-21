// miniprogram/pages/site/update-password/update-password.js
const myRequest = require('../../../api/myRequest')

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 进入相应页面
   */
  toPage: function (event) {
    let url = ''
    let q = event.currentTarget.id
    switch (q) {
      case 'password':
        url = `/pages/site/update-password/update-password`
        break
      case 'motto':
        url = `/pages/site/update-motto/update-motto`
        break
    }
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 退出
   */
  logout: function (event) {
    let _self = this
    let sessionId = wx.getStorageSync('sessionId')
    wx.showLoading()
    myRequest.call('site', {
      $url: "logout",
      sessionId: sessionId
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.removeStorageSync('sessionId')
      wx.removeStorageSync('userId')
      wx.removeStorageSync('username')
      wx.removeStorageSync('userType')
      wx.removeStorageSync('motto')
      wx.switchTab({
        url: '/pages/index/index',
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showModal({
        content: err && err.message || '操作失败',
        showCancel: false
      })
    })
  }
})