// miniprogram/pages/book/detail/detail.js

const utils = require('../../../utils/utils')
const myRequest = require('../../../api/myRequest')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    isBorrowed: false,
    book: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _self = this

    myRequest.call('book', {
      $url: "detail",
      id: this.data.id,
      userId: 'W69vv_D0YIt7pmfH'
    }).then(res => {
      console.log(res)
      this.setData({
        book: res.book,
        isBorrowed: res.isBorrowed
      })
      wx.setNavigationBarTitle({
        title: (this.data.book.title || '图书详情'),
      })
    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: '无法拉取图书信息',
      })
    })
  },

  /**
   * 借书
   */
  borrowBook: function () {
    let _self = this
    let book = this.data.book
    let sTime = new Date().getTime()/1000
    let sDate = utils.formatTime(sTime, 'Y-M-D')
    let eTime = utils.getExpireTime(sTime, 60)
    let eDate = utils.formatTime(eTime, 'Y-M-D')

    if (book.available_num < 1){
      return false
    }
    wx.showModal({
      title: '提示',
      content: '确认借阅',
      success: function(res) {
        if(res.confirm) {
          let borrowData = {
            bookId: book._id,
            userId: 'W69vv_D0YIt7pmfH',
            status: 0,
            start_date: sDate,
            start_time: sTime,
            expire_date: eDate,
            expire_time: eTime
          }
          let available_num = book.available_num - 1

          wx.showLoading()
          myRequest.call('book', {
            $url: "borrow",
            borrowData,
            available_num
          }).then(res => {
            console.log(res)
            wx.hideLoading()
            wx.showToast({
              title: '借阅成功',
              complete: () => {
                _self.onShow()
              }
            })
          }).catch(err => {
            console.log('====: ', err)
            wx.hideLoading()
            wx.showModal({
              content: '系统错误，请稍后再试',
            })
          })
        }
      }
    })
  }
  
})