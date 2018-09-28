// miniprogram/pages/book/h-list/h-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [{
      id: 1,
      title: '测试用书',
      author: 'coco',
      start_date: '2018-09-09',
      end_date: '2018-10-01',
      expire_date: '2018-10-09'
    }, {
      id: 2,
      title: '测试用书2',
      author: 'coco2',
      start_date: '2018-09-09',
      end_date: '2018-10-01',
      expire_date: '2018-10-09'
    }, {
      id: 3,
      title: '测试用书3',
      author: 'coco3',
      start_date: '2018-09-09',
      end_date: '2018-10-01',
      expire_date: '2018-10-09'
    }],
    pageType: 'current'
  },

  reRent: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定要续借这本吗？',
    })
  },

  return: function (e) {
    wx.showModal({
      title: '提示',
      content: '确定归还',
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