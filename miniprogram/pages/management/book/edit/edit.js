// miniprogram/pages/book/edit/edit.js

let utils = require('../../../../utils/utils')
const myRequest = require('../../../../api/myRequest')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBookInfo: false,
    isRecommend: false,
    userId: 'W69vv_D0YIt7pmfH',
    book: {
      isbn: 9787500656524,
      owner: 'web组',
      place: '9F B办公区靠窗',
      num: 1,
      available_num: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type === 'recommend'){
      this.setData({
        isRecommend: true
      })
      return
    }
    if(!options.id){
      return
    }

    wx.setNavigationBarTitle({
      title: ('编辑图书'),
    })
    
    let _self = this

    this.setData({
      isEdit: true
    })
  
    myRequest.call('book', {
      $url: "detail",
      id: options.id
    }).then(res => {
      console.log(res)
      _self.setData({
        book: res.book,
       'book.isbn': res.book.isbn13,
      })
      
    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: '无法拉取图书信息',
      })
    })
  },

  /**
   * 同步输数据
   */
  onBlur: function (e) {
    console.log(e.currentTarget.id, e.detail.value)
    let key = e.currentTarget.id
    let value = e.detail.value

    let newData = this.data.book
    newData[key] = value
    this.setData({
      book: newData
    })
  },

  /**
   * 通过 isbn 从豆瓣拉取图书信息
   */
  search: function (e) {
    let _self = this
    wx.showLoading()
    wx.request({
      url: 'https://douban.uieee.com/v2/book/isbn/' + this.data.book.isbn,
      header: {
        'content-type': 'json'
      },
      success: res => {
        wx.hideLoading()
        if(res.statusCode !== 200){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
          })
          _self.setData({
            showBookInfo: false
          })
          return
        }

        let data = res.data
        _self.setData({
          showBookInfo: true,
          'book.author': data.author.join(' / '),
          'book.author_intro': data.author_intro,
          'book.image': data.image,
          'book.title': data.title,
          'book.publisher': data.publisher,
          'book.translator': data.translator.join(' / '),
          'book.tags': data.tags.join(' | '),
          'book.content_intro': data.summary,
          'book.isbn10': data.isbn10,
          'book.isbn13': data.isbn13,
          'book.catalog': data.catalog
        })
      },
      fail: err => {
        wx.showModal({
          content: '查询失败',
          showCancel: false
        })
        _self.setData({
          showBookInfo: false
        })
      }
    })
  },

  /**
   * 添加书籍
   */
  addBook: function(e) {
    let _self = this
    let aData = this.data.book
    aData.available_num = aData.num
    aData.status = "ONSHELF"
    
    myRequest.call('book', {
      $url: "add",
      data: aData,
      isbn: aData.isbn
    }).then(res => {
      wx.showToast({
        title: '添加成功',
        complete: () => {
          setTimeout(() => {
            wx.navigateBack({
              url: '../list/list'
            })
          }, 1000)
        }
      })
    }, (err) => {
      wx.showModal({
        title: '提示',
        content: err.message,
        showCancel: false
      })
    })
  },

  /**
   * 编辑书籍
   */
  editBook: function() {
    let _self = this

    let eData = Object.assign({}, _self.data.book)
    delete eData._openid
    delete eData.isbn
    delete eData._id
    delete eData.isbn10
    delete eData.isbn13

    console.log(eData)

    myRequest.call('book', {
      $url: "edit",
      data: eData,
      bookId: _self.data.book._id
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '编辑成功',
        complete: res => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: '操作失败',
      })
    })
  },

  /**
   * 推荐书籍
   */
  doRecommend: function () {
    let _self = this
    let aData = this.data.book
    aData.num = 0
    aData.available_num = 0
    aData.status = "PENDING"
    let rTime = new Date().getTime() / 1000
    let rDate = utils.formatTime(rTime, 'Y-M-D')

    myRequest.call('book', {
      $url: "recommend",
      isbn: aData.isbn,
      data: aData,
      userId: 'W69vv_D0YIt7pmfH',
      date: rDate
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '提交成功',
        complete: () => {
          setTimeout(() => {
            wx.navigateBack({
              url: '../list/list'
            })
          }, 1000)
        }
      })
    }).catch(err => {
      console.log(err)
      wx.showModal({
        title: '提示',
        content: err.message,
        showCancel: false
      })
    })
  }
  
})