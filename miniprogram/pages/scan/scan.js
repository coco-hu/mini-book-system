// miniprogram/pages/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    top: 14,

    left: 14,

    windowWidth: '',

    windowHeight: ''

  },
  setTouchMove: function (e) {
    let wWidth = wx.getSystemInfoSync().windowWidth - 40 - 34
    let wHeight = wx.getSystemInfoSync().windowHeight - 40 -34

    let x = e.touches[0].clientX - 34
    x = x < 0 ? 14 : (x > wWidth ? wWidth : x)
    let y = e.touches[0].clientY - 34
    y = y < 0 ? 14 : (y > wHeight ? wHeight : y)

    this.setData({
      left: x,
      top: y
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.scanCode({
    //   onlyFromCamera: true,
    //   success: (res) => {
    //     alert(res.result)
    //   }
    // })
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