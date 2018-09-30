// miniprogram/pages/book/m-list/m-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: []
  },

  delete: function (e) {
    const db = wx.cloud.database()
    let _self = this
    wx.showModal({
      title: '提示',
      content: '确定要删除这本书吗？',
      success: function (res) {
        if(res.confirm){
          db.collection('book').doc(e.currentTarget.id).remove().then(res => {
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

  edit: function (event) {
    wx.navigateTo({
      url: `../edit/edit?id=${event.currentTarget.id}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    let _self = this

    db.collection('book').field({
      title: true,
      author: true,
      _id: true
    }).get().then(res => {
      console.log(res)
      let data = res.data.map(item => {
        item.titleLength = item.title.replace(/[^\u0000-\u00ff]/g, "aa").length
        return item
      })
      _self.setData({
        booklist: data
      })
    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: '操作失败'
      })
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

})