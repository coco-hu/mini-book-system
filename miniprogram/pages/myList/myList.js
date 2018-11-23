// miniprogram/pages/myList/myList.js

const myRequest = require('../../api/myRequest')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    borrowNum: 0,
    expiredNum: 0,
    recommendNum: 0,
    userInfo: {
      nickName: '未知',
      avatarUrl: '',
      motto: 'Where there\'s a will there\'s a way. '
    }
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
                'userInfo.avatarUrl': res.userInfo.avatarUrl,
              })
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
    let sessionId = wx.getStorageSync('sessionId')
    let username = wx.getStorageSync('username')
    let userType = wx.getStorageSync('userType')
    let motto = wx.getStorageSync('motto')

    this.setData({
      'userInfo.nickName': username,
      'userInfo.motto': motto,
      'userInfo.isAdmin': +userType === 1
    })

    if (!sessionId){
      wx.navigateTo({
        url: '/pages/site/login/login',
      })
      return;
    }
    this.getCountInfo()
  },

  /**
   * 获取统计数据
   */
  getCountInfo: function() {
    let _self = this
    let userId = wx.getStorageSync('userId')
    myRequest.call('book', {
      $url: "count-sum",
      userId: userId,
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
      if (!app.checkLogin(err.code)) {
        return
      }
      console.log("==", err)
      wx.showModal({
        content: err.message,
        showCancel: false
      })
    })

  },

  /**
   * 设置页
   */
  toSetting: function () {
    wx.navigateTo({
      url: '/pages/site/setting/setting'
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
      case 'all-borrow-list':
        url = '/pages/management/book/borrow-list/borrow-list'
        break
    }
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  }
})