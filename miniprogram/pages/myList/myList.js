// miniprogram/pages/myList/myList.js

const myRequest = require('../../api/myRequest')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    borrowNum: 0,
    expiredNum: 0,
    recommendNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              console.log(res)
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    let _self = this

    myRequest.call('book', {
      $url: "count-sum",
      userId: "9787500656524",
      status: 0
    }).then(res => {
      console.log(res)
      let data = res
      _self.setData({
        borrowNum: data.borrowNum,
        expiredNum: data.expiredNum,
        recommendNum: data.recommendNum
      })
    }).catch(err => {
      console.log("==", err)
      wx.showModal({
        content: '拉取数据失败',
      })
    })

  },

  /**
   * 进入相应页面
   */
  toPage: function (event) {
    let url = ''
    let q = event.currentTarget.id
    switch(q){
      case 'current':
      case 'history':
        url = `/pages/book/h-list/h-list?type=${q}`
        break
      case 'recommend':
        url = `/pages/book/recommend/recommend`
        break
      case 'book-management':
        url = `/pages/management/book/list/list`
        break
      case 'user-management':
        url = `/pages/management/user/list/list`
        break
      case 'recommend-list':
        url = `/pages/management/book/recommend-list/recommend-list`
        break
      case 'overdue-list':
        url = `/pages/management/book/overdue-list/overdue-list`
        break
    }
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  }
})