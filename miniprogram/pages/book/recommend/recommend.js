// miniprogram/pages/book/recommend/recommend.js

const myRequest = require('../../../api/myRequest')
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
    this.getRecommendList();
  },

  /**
   * 获取推荐列表
   */
  getRecommendList: function () {
    let _self = this
    let userId = wx.getStorageSync('userId')
    wx.showLoading()
    myRequest.call('book', {
      $url: "recommend-list",
      userId: userId,
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      _self.setData({
        booklist: res.list,
        booklistLength: res.list.length
      })
    }).catch(err => {
      console.error(err)
      wx.hideLoading()
      if (!app.checkLogin(err.code)) {
        return
      }
      _self.setData({
        booklistLength: 0
      })
      wx.showModal({
        content: '拉取数据失败',
      })
    })

  },

  /**
   * 添加推荐
   */
  toRecommend: function() {
    wx.navigateTo({
      url: '/pages/management/book/edit/edit?type=recommend',
    })
  },

  /**
   * 去详情页
   */
  toDetail: function (e) {
    wx.navigateTo({
      url: `/pages/book/detail/detail?id=${e.currentTarget.id}`,
    })
  }
  
})