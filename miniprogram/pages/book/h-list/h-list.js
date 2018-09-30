// miniprogram/pages/book/h-list/h-list.js

let utils = require('../../../utils/utils')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [],
    pageType: 'current'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    const _ = db.command
    let bidArr = []
    let borrowArr = [];
    let bookArr = [];
    let _self = this

    this.setData({
      pageType: options.type
    })

    db.collection('borrow').where({
      userId: 'W69vv_D0YIt7pmfH',
      status: options.type === 'current' ? 0 : 1
    }).get().then(res => {
      borrowArr = res.data;
      for (let i = 0; i < borrowArr.length; i++){
        bidArr.push(res.data[i].bookId);
      }
      
      if(bidArr.length > 0){
        db.collection('book').where({
          _id: _.in(bidArr)
        }).get().then(res => {
          let data = []
          bookArr = res.data;
          for(let i=0, j=0; i<borrowArr.length; i++){
            for(j=0; j<bookArr.length; j++){
              if(borrowArr[i].bookId === bookArr[j]._id){
                data.push(Object.assign({
                  titleLength: bookArr[j].title.replace(/[^\u0000-\u00ff]/g, "aa").length
                }, bookArr[j], borrowArr[i]))
                break
              }
            }
          }
          _self.setData({
            booklist: data
          })
        })
      }
    }).catch(err => {
      console.error(err)
      wx.showModal({
        content: '拉取数据失败',
      })
    })
  },

  /**
   * 续借
   */
  reRent: function (e) {
    const db = wx.cloud.database()
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
          db.collection('borrow').doc(item._id).update({
            data: {
              expire_date: eDate,
              expire_time: eTime
            }
          }).then(res => {
            wx.showToast({
              title: '续借成功',
            })
            let newBookList = _self.data.booklist
            newBookList[index].expire_date = eDate
            newBookList[index].expire_time = eTime
            _self.setData({
              'booklist': newBookList
            })
            console.log(_self.data.booklist);

            console.log(res)
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
    const db = wx.cloud.database()
    const _ = db.command
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
          let promise1 = db.collection('borrow').doc(item._id).update({
            data: {
              status: 1,
              end_date: eDate,
              end_time: eTime
            }
          })
          let promise2 = db.collection('book').doc(item.bookId).update({
            data: {
              available_num: _.inc(1)
            }
          })
          Promise.all([
            promise1,
            promise2
          ]).then(res => {
            console.log(res)
            wx.showToast({
              title: '还书成功',
              complete: () => {
                _self.onLoad({type: _self.data.pageType})
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