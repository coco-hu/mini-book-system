// miniprogram/pages/book/h-list/h-list.js

const utils = require('../../../utils/utils')
const myRequest = require('../../../api/myRequest')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [],
    booklistLength: '',
    pageType: 'current'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageType: options.type
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _self = this
    let _type = this.data.pageType

    myRequest.call('book', {
      $url: "borrow-list",
      userId: 'W69vv_D0YIt7pmfH',
      status: _type === 'current' ? 0 : 1
    }).then(res => {
      console.log('===', res)
      _self.setData({
        booklist: res.list,
        booklistLength: res.list.length
      })
    }).catch(err => {
      _self.setData({
        booklistLength: 0
      })
      wx.showModal({
        content: '拉取数据失败',
      })
    })

  },

  /**
   * 续借
   */
  reRent: function (e) {
    let _self = this
    let index = e.currentTarget.id
    let item = this.data.booklist[index]
    let eTime = utils.getExpireTime(item.expire_time, 30)
    let eDate = utils.formatTime(eTime, 'Y-M-D')
    wx.showModal({
      title: '提示',
      content: '确定要续借这本吗？',
      success: (res) => {
        if (res.confirm) {
          myRequest.call('book', {
            $url: "renew",
            id: item._id,
            expire_date: eDate,
            expire_time: eTime
          }).then(res => {
            wx.showToast({
              title: '续借成功',
              complete: () => {
                _self.onShow()
              }
            })
          }).catch(err => {
            console.log(err)
            wx.showModal({
              content: '操作失败',
            })
          })
        }
      }
    })
  },

  /**
   * 归还
   */
  retBook: function (e) {
    let _self = this
    let index = e.currentTarget.id
    let item = this.data.booklist[index]
    let eTime = new Date().getTime()/1000
    let eDate = utils.formatTime(eTime, 'Y-M-D')

    wx.showModal({
      title: '提示',
      content: '确定归还',
      success: (res) => {
        if (res.confirm) {
          myRequest.call('book', {
            $url: "return",
            borrowId: item._id,
            bookId: item.bookId,
            end_date: eDate,
            end_time: eTime,
          }).then(res => {
            console.log(res)
            wx.showToast({
              title: '还书成功',
              complete: () => {
                _self.onShow()
              }
            })
          }).catch(err => {
            console.log(err)
            wx.showModal({
              content: '操作失败'
            })
          })
        }
      }
    })
  },

  /**
   * 去图书详情页
   */
  toDetail: function (e) {
    wx.navigateTo({
      url: `/pages/book/detail/detail?id=${e.currentTarget.id}`,
    })
  }

})