// pages/site/update-password/update-password.js
const myRequest = require('../../../api/myRequest')
const MD5 = require('../../../utils/md5')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      password: '',
      newPassword: '',
      confirm: ''
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
   * 修改密码
   */
  update: function (e) {
    let _self = this
    let id = wx.getStorageSync('userId')
    let user = this.data.user;
    if (!user.password) {
      wx.showModal({
        content: '请输入当前密码',
        showCancel: false
      })
      return
    } 
    if(!user.newPassword) {
      wx.showModal({
        content: '请输入新密码',
        showCancel: false
      })
      return
    }
    if (!user.confirm) {
      wx.showModal({
        content: '请确认新密码',
        showCancel: false
      })
      return
    }
    if (user.newPassword !== user.confirm) {
      wx.showModal({
        content: '二次密码不一致',
        showCancel: false
      })
      return
    }

    if (user.password === user.newPassword) {
      wx.showModal({
        content: '新旧密码不能相同',
        showCancel: false
      })
      return
    }
    wx.showLoading()
    myRequest.call('site', {
      $url: "update-password",
      id: id,
      password: MD5(user.password),
      newPassword: MD5(user.newPassword)
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.navigateTo({
        url: '/pages/site/login/login',
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