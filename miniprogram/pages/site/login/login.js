// miniprogram/pages/site/login/login.js

const myRequest = require('../../../api/myRequest')

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
   * 同步输入数据
   */
  onBlur: function (e) {
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
    if(!this.data.user.username || !this.data.user.password){
      wx.showModal({
        content: '用户名/密码不能为空',
        showCancel: false
      })
      return
    }
    myRequest.call('site', {
      $url: "login",
      user: _self.data.user
    }).then(res => {
      console.log(res)
      wx.setStorageSync('sessionId', res.sessionId)
      wx.setStorageSync('userId', res.user.userId)
      wx.setStorageSync('username', res.user.username)
      wx.setStorageSync('userType', res.user.userType)
  
    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: err && err.message || '操作失败',
        showCancel: false
      })
    })

  }
})