// miniprogram/pages/management/book/h-list/h-list.js

const myRequest = require('../../../../api/myRequest')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [],
    booklistLength: '',
    currentIndex: 0,
    hasLoadAll: false,
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      booklist: [],
      booklistLength: '',
      currentIndex: 0,
      hasLoadAll: false,
    })
    this.getRecommendList()
  },

  /**
   * 拉取推荐列表
   */
  getRecommendList: function() {
    const UNIT = 100
    let _self = this

    this.setData({
      showLoading: true
    })
    myRequest.call('book', {
      $url: "all-recommend-list",
      size: UNIT,
      startIndex: this.data.currentIndex
    }).then(res => {
      console.log(res)

      let data = res && res.list || []
      let booklist = this.data.booklist.concat(data)

      _self.setData({
        showLoading: false,
        booklist: booklist,
        booklistLength: booklist.length,
        currentIndex: this.data.currentIndex + UNIT
      })
      if (!data || data.length < UNIT) {
        this.setData({
          hasLoadAll: true
        })
      }
    }).catch(err => {
      console.error(err)
      if (!app.checkLogin(err.code)) {
        return
      }
      _self.setData({
        booklistLength: 0
      })
      wx.showModal({
        content: err && err.message,
        showCancel: false
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
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasLoadAll) {
      return false
    }

    this.getBooklist()
  }

})