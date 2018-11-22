// miniprogram/pages/user/list/list.js

const myRequest = require('../../../../api/myRequest')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlist: [],
    userlistLength: ''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let currentUser = wx.getStorageSync('userId')
    this.setData({
      currentUser: currentUser
    })
    this.getUserList()
  },

  /**
   * 拉取用户列表
   */
  getUserList: function() {
    let _self = this

    wx.showLoading()
    myRequest.call('user', {
      $url: "list"
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      _self.setData({
        userlist: res.list,
        userlistLength: res.list.length
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      _self.setData({
        userlistLength: 0
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
   * 删除用户
   */
  delete: function (e) {
    const db = wx.cloud.database()
    let _self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该用户吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading()
          myRequest.call('user', {
            $url: "delete",
            id: e.currentTarget.id
          }).then(res => {
            console.log(res)
            wx.hideLoading()
            _self.onShow()
          }).catch(err => {
            if (!app.checkLogin(err.code)) {
              return
            }
            wx.hideLoading()
            wx.showModal({
              content: err.message || '操作失败',
              showCancel: false
            })
          })
        }
      }
    })
  },

  /**
   * 去编辑页
   */
  edit: function (e) {
    wx.navigateTo({
      url: `../edit/edit?id=${e.currentTarget.id}`,
    })
  }

})