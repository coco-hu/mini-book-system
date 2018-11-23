// miniprogram/pages/book/m-list/m-list.js

const myRequest = require('../../../../api/myRequest')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [],
    booklistLength: ''
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getBooklist()
  },

  /**
   * 获取全部图书列表
   */
  getBooklist: function() {
    const db = wx.cloud.database()
    let _self = this
    wx.showLoading()
    myRequest.call('book', {
      $url: "booklist",
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      _self.setData({
        booklist: res.list,
        booklistLength: res.list.length
      })
    }).catch(err => {
      wx.hideLoading()
      if (!app.checkLogin(err.code)) {
        return
      }
      _self.setData({
        booklistLength: 0
      })
      wx.showModal({
        content: err.message,
        showCancel: false
      })
    })
  },

  /**
   * 删除图书
   */
  delete: function (e) {
    const db = wx.cloud.database()
    let _self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除这本书吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading()
          myRequest.call('book', {
            $url: "delete",
            id: e.currentTarget.id
          }).then(res => {
            console.log(res)
            wx.hideLoading()
            _self.onShow()
          }).catch(err => {
            console.log(err)
            if (!app.checkLogin(err.code)) {
              return
            }
            wx.hideLoading()
            wx.showModal({
              content: err.message,
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
  edit: function (event) {
    wx.navigateTo({
      url: `../edit/edit?id=${event.currentTarget.id}`,
    })
  },

})