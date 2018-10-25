// miniprogram/pages/user/list/list.js

const myRequest = require('../../../../api/myRequest')

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
    const db = wx.cloud.database()
    let _self = this

    myRequest.call('user', {
      $url: "list"
    }).then(res => {
      console.log(res)
      _self.setData({
        userlist: res.list,
        userlistLength: res.list.length
      })
    }).catch(err => {
      console.log(err)
      _self.setData({
        userlistLength: 0
      })
      wx.showModal({
        content: '操作失败'
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
          myRequest.call('user', {
            $url: "delete",
            id: e.currentTarget.id
          }).then(res => {
            console.log(res)
            wx.showToast({
              title: '删除成功',
              complete: () => {
                _self.onShow()
              }
            })
          }).catch(res => {
            wx.showModal({
              content: '操作失败',
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