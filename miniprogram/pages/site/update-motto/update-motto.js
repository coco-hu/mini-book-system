// miniprogram/pages/site/setting/update-motto/update-motto.js
const myRequest = require('../../../api/myRequest')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {
      motto: '',
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      user:{
        motto: wx.getStorageSync('motto')
      } 
    })
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
   * 修改座右铭
   */
  update: function (e) {
    let _self = this
    let id = wx.getStorageSync('userId')
    console.log(this.data)
    if (!this.data.user.motto) {
      wx.showModal({
        content: '座右铭不能为空',
        showCancel: false
      })
      return
    }
    wx.showLoading()
    myRequest.call('site', {
      $url: "update-motto",
      id: id,
      motto: _self.data.user.motto
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.setStorageSync('motto', _self.data.user.motto)
      wx.navigateBack({
        delta: 1
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