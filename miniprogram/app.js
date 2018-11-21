//app.js

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {}
  },
  isLogin: function () {
    let userId = wx.getStorageSync('userId')
    let username = wx.getStorageSync('username')
    if(userId && username){
      return true
    }
    return false
  },
  checkLogin: function (code) {
    if (+code === 101) {
      wx.navigateTo({
        url: '/pages/site/login/login',
      });
      return false
    }else {
      return true
    }
  }
})
