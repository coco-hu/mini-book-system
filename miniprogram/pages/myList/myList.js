// miniprogram/pages/myList/myList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

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
              console.log(res);
            }
          })
        }
      }
    })
  },

  /**
   * 进入相应页面
   */
  toPage: function (event) {
    let url = '';
    let q = event.currentTarget.id
    switch(q){
      case 'current':
      case 'history':
        url = `/pages/book/h-list/h-list?type=${q}`
        break
      case 'order':
      case 'recommend':
        url = `/pages/book/list/list?type=${q}`
        break
      case 'book-management':
        url = `/pages/management/book/m-list/m-list`
        break
      case 'user-management':
        url = `/pages/management/user/list/list`
        break
      case 'recommend-list':
      case 'shopping-list':
      case 'overdue-list':
        let _type = q.split('-')[0]
        url = `/pages/management/book/h-list/h-list?type=${_type}`
        break
    }
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  }
})