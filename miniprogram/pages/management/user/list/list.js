// miniprogram/pages/user/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlist: [{
      id: 1,
      username: 'coco',
      type: 1,
      password: ''
    }, {
      id: 2,
      username: 'toobug',
      type: 1,
      password: ''
    }, {
      id: 3,
      username: 'jedi',
      type: 1,
      password: ''
    }, {
      id: 4,
      username: 'diandian',
      type: 0,
      password: ''
    }]
  },
  
  delete: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除该用户吗？',
    })
  },

  edit: function (e) {
    wx.navigateTo({
      url: `../edit/edit?id=${e.currentTarget.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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