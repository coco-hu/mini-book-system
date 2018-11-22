// miniprogram/pages/book/detail/detail.js

const utils = require('../../../utils/utils')
const localRequest = require('../../../api/localRequest')
const myRequest = require('../../../api/myRequest')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    isLogin: false,
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

    this.setData({
      isLogin: app.isLogin()
    })
    this.getBookDetail()
  },

  /**
   * 拉取图书信息
   */
  getBookDetail: function() {
    wx.showLoading()
    localRequest.getBookDetail({
      id: this.data.id
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      this.setData({
        book: res.book
      })
      wx.setNavigationBarTitle({
        title: (this.data.book.title || '图书详情'),
      })
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      if (!app.checkLogin(err.code)) {
        return
      }
      wx.showModal({
        content: '无法拉取图书信息',
        showCancel: false 
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

    let userId = wx.getStorageSync('userId')
    if (book.borrowed_num >= book.num){
      return false
    }
    wx.showModal({
      title: '提示',
      content: '确认借阅',
      success: function(res) {
        if(res.confirm) {
          let borrowData = {
            bookId: book._id,
            userId: userId,
            status: 0,
            start_date: sDate,
            start_time: sTime,
            expire_date: eDate,
            expire_time: eTime
          }

          wx.showLoading()
          myRequest.call('book', {
            $url: "borrow",
            borrowData
          }).then(res => {
            console.log(res)
            wx.hideLoading()
            _self.onShow()
          }).catch(err => {
            console.log('====: ', err)
            if (!app.checkLogin(err.code)) {
              return
            }
            wx.hideLoading()
            wx.showModal({
              content: err && err.message || '系统错误，请稍后再试',
              showCancel: false
            })
          })
        }
      }
    })
  }
  
})