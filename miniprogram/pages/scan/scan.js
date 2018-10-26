// miniprogram/pages/scan/scan.js

const myRequest = require('../../api/myRequest')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    needScan: true
  },
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _self = this
    let needScan = this.data.needScan

    this.setData({
      needScan: !needScan
    })
    if(!needScan){
      return;
    }
    wx.scanCode({
      success: (res) => {

        myRequest.call('book', {
          $url: "search-isbn",
          isbn: '9787500656524'
        }).then(res => {
          console.log(res)
          wx.navigateTo({
            url: `/pages/book/detail/detail?id=${res.id}`,
          })
        }).catch(err => {
          console.log(err)
          wx.showModal({
            content: err && err.message + '9787500656524',
            complete: () => {
              wx.navigateTo({
                url: '/pages/index/index',
              })
            }
          })
        })
      },
      fail: (err) => {
        wx.showToast({
          title: err,
          complete: () => {
            wx.navigateTo({
              url: '/pages/index/index',
            })
          }
        })
      }
    })
  }
})