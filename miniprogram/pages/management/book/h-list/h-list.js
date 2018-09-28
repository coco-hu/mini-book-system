// miniprogram/pages/management/book/h-list/h-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [{
      id: 1,
      title: '测试用书',
      author: 'coco',
      overdue_days: 2,
      borrower: 'somebody',
      buy_date: '2018-10-09',
      recommender: 'somebody'
    }, {
        id: 1,
        title: '测试用书2',
        author: 'coco2',
        overdue_days: 2,
        borrower: 'somebody',
        buy_date: '2018-10-09',
        recommender: 'somebody'
      }, {
        id: 1,
        title: '测试用书2',
        author: 'coco2',
        overdue_days: 2,
        borrower: 'somebody',
        buy_date: '2018-10-09',
        recommender: 'somebody'
      }],
    pageType: 'overdue'
  },

  remind: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要发送提醒吗？',
    })
  },

  agree: function (e) {
    wx.showModal({
      title: '提示',
      content: '同意购买',
    })
  },

  reject: function (e) {
    wx.showModal({
      title: '提示',
      content: '不同意购买',
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
      title: '逾期书籍列表',
    })
    this.setData({
      pageType: options.type
    });
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