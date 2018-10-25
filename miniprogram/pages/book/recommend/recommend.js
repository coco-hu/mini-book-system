// miniprogram/pages/book/recommend/recommend.js

const myRequest = require('../../../api/myRequest')

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
    let _self = this

    myRequest.call('book', {
      $url: "recommend-list",
      userId: 'W69vv_D0YIt7pmfH',
    }).then(res => {
      console.log(res)
      _self.setData({
        booklist: res.list,
        booklistLength: res.list.length
      })
    }).catch(err => {
      console.error(err)
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