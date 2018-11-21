// miniprogram/pages/site/login/login.js

const myRequest = require('../../../api/myRequest')
const MD5 = require('../../../utils/md5')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      username: '',
      password: ''
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.removeStorageSync('sessionId')
    wx.removeStorageSync('userId')
    wx.removeStorageSync('username')
    wx.removeStorageSync('userType')
    wx.removeStorageSync('motto')
  },

  /**
   * 同步输入数据
   */
  onInput: function (e) {
    let key = e.currentTarget.id
    let value = e.detail.value

    let newData = this.data.user
    newData[key] = value
    this.setData({
      user: newData
    })
  },

  /**
   * 登录
   */
  login: function (e) {
    let _self = this
    let user = this.data.user
    if(!user.username || !user.password){
      wx.showModal({
        content: '用户名/密码不能为空',
        showCancel: false
      })
      return
    }
    wx.showLoading()
    myRequest.call('site', {
      $url: "login",
      user: {
        username: user.username,
        password: MD5(user.password)
      }
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.setStorageSync('sessionId', res.sessionId)
      wx.setStorageSync('userId', res.user.userId)
      wx.setStorageSync('username', res.user.username)
      wx.setStorageSync('userType', res.user.userType)
      wx.setStorageSync('motto', res.user.motto)
      wx.switchTab({
        url: '/pages/myList/myList',
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showModal({
        content: err && err.message || '操作失败',
        showCancel: false
      })
    })
  },
  /**
   * 返回首页
   */
  goIndex: function() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})