// miniprogram/pages/management/book/h-list/h-list.js

const myRequest = require('../../../../api/myRequest')

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
      $url: "all-recommend-list",
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
        content: err && err.message,
      })
    })
  },

  agree: function (e) {
    let _self = this
    let id = e.currentTarget.id

    wx.showModal({
      title: '提示',
      content: '同意购买',
      success: function (res) {
        if (res.confirm) {
          myRequest.call('book', {
            $url: "recommend-agree",
            id: id
          }).then(res => {
            _self.onShow()
          }).catch(res => {
            wx.showToast({
              title: '操作失败'
            })
          })
        }
      }
    })
  },

  reject: function (e) {
    let _self = this
    let id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '不同意购买',
      success: function (res) {
        if (res.confirm) {
          myRequest.call('book', {
            $url: "recommend-reject",
            id: id
          }).then(res => {
            _self.onShow()
          }).catch(res => {
            wx.showToast({
              title: '操作失败'
            })
          })
        }
      }
    })
  },
  onShelf: function (e) {
    let _self = this
    let id = e.currentTarget.id
    wx.showModal({
      title: '提示',
      content: '上架图书',
      success: function(res){
        if(res.confirm){
          myRequest.call('book', {
            $url: "recommend-on-shelf",
            id: id
          }).then(res => {
            _self.onShow()
          }).catch(res => {
            wx.showToast({
              title: '操作失败'
            })
          })
        }
      }
    })
  },
  toDetail: function (e) {
    wx.navigateTo({
      url: `/pages/book/detail/detail?id=${e.currentTarget.id}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '推荐书籍列表',
    })
  }
})