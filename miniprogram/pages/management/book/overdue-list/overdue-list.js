// miniprogram/pages/management/book/overdue-list/overdue-list.js

const myRequest = require('../../../../api/myRequest')

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
    wx.setNavigationBarTitle({
      title: '逾期书籍列表',
    })
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
    let _self = this

    myRequest.call('book', {
      $url: "overdue-list",
    }).then(res => {
      console.log(res)
      _self.setData({
        booklist: res.list,
        booklistLength: res.list.length
      })
    }).catch(err => {
      console.error(err)
      _self.setData({
        booklist: [],
        booklistLength: 0
      })
      wx.showModal({
        content: '拉取数据失败',
      })
    })
  }
  
})