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

  },

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
  },

  toUserList: function () {
    wx.navigateTo({
      url: '../user/list/list',
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})