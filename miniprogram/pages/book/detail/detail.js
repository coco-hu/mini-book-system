// miniprogram/pages/book/detail/detail.js

let utils = require('../../../utils/utils')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    let records = db.collection('book');
    records.where({
      _id: options.id
    }).get().then(res => {
      console.log(res);
      this.setData({
        book: res.data[0]
      });
      wx.setNavigationBarTitle({
        title: (this.data.book.title || '图书详情'),
      })
    }).catch(err => {
      wx.showModal({
        content: '无法拉取图书信息',
      })
    })
  },

  /**
   * 借书
   */
  borrowBook: function () {
    let _self = this;
    let book = this.data.book
    let sTime = new Date().getTime()/1000
    let sDate = utils.formatTime(sTime, 'Y-M-D')
    let eTime = utils.getExpireTime(sTime, 60)
    let eDate = utils.formatTime(eTime, 'Y-M-D')

    if (book.available_num < 1){
      return false;
    }
    wx.showModal({
      title: '提示',
      content: '确认借阅',
      success: function(res) {
        if(res.confirm) {
          const db = wx.cloud.database();

          let promise1 = db.collection('borrow').add({
            data: {
              bookId: book._id,
              userId: 'W69vv_D0YIt7pmfH',
              status: 0,
              start_date: sDate,
              start_time: sTime,
              expire_date: eDate,
              expire_time: eTime
            }
          })
          let promise2 = db.collection('book').doc(book._id).update({
            data: {
              available_num: book.available_num - 1
            },
          })
          wx.showLoading()
          Promise.all([
            promise1,
            promise2
          ])
          .then(res => {
            _self.setData({
              'book.available_num': book.available_num - 1
            })
            console.log(res);
            wx.hideLoading()
            wx.showToast({
              title: '借阅成功',
            })
          }).catch(err => {
            console.log('====: ', err);
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