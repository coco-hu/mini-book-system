// miniprogram/pages/book/m-list/m-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [{
      id: 1,
      title: '测试用书',
      author: 'coco',
    }, {
      id: 2,
      title: '测试用书2',
      author: 'coco2',
    }, {
      id: 3,
      title: '测试用书3',
      author: 'coco3',
    }]
  },

  delete: function (event) {
    wx.showModal({
      title: '提示',
      content: '确定要删除该用户吗？',
    })
  },

  edit: function (event) {
    wx.navigateTo({
      url: `../edit/edit?id=${event.currentTarget.id}`,
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