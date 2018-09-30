// miniprogram/pages/user/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userlist: []
  },
  
  delete: function (e) {
    const db = wx.cloud.database()
    let _self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除该用户吗？',
      success: function (res) {
        if (res.confirm) {
          db.collection('user').doc(e.currentTarget.id).remove().then(res => {
            console.log(res)
            wx.showToast({
              title: '删除成功',
              complete: () => {
                _self.onLoad()
              }
            })
          }).catch(res => {
            wx.showModal({
              content: '操作失败',
              showCancel: false
            })
          })
        }
      }
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
    const db = wx.cloud.database()
    let _self = this

    db.collection('user').field({
      username: true,
      userType: true,
      _id: true
    }).get().then(res => {
      console.log(res)
    
      _self.setData({
        userlist: res.data
      })
    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: '操作失败'
      })
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