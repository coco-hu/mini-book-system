// miniprogram/pages/book/edit/edit.js

let utils = require('../../../../utils/utils')
const myRequest = require('../../../../api/myRequest')
const localRequest = require('../../../../api/localRequest')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBookInfo: false,
    isRecommend: false,
    userId: '',
    multiIsbn: '',
    book: {
      isbn: '',
      owner: 'web组',
      place: '9F B办公区靠窗',
      num: 1,
      borrowed_num: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type === 'recommend'){
      wx.setNavigationBarTitle({
        title: ('推荐书籍'),
      })
      this.setData({
        isRecommend: true
      })
      return
    }
    if(!options.id){
      return
    }

    wx.setNavigationBarTitle({
      title: ('编辑书籍'),
    })
    
    
    this.setData({
      isEdit: true
    })
    this.getBookInfo(options.id)
  },
  /**
   * 获取图书信息
   */
  getBookInfo: function (id) {
    let _self = this

    wx.showLoading()
    localRequest.getBookDetail({
      id: id
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      _self.setData({
        book: res.book,
       'book.isbn': res.book.isbn13,
      })
      
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      if (!app.checkLogin(err.code)) {
        return
      }
      wx.showModal({
        content: err.message,
        showCancel: false 
      })
    })
  },
  
  /**
   * 切换添加方式
   */
  switchTap: function(e) {
    let type = e.currentTarget.id
    this.setData({
      isMultiAdd: type === 'multiAdd'
    })
  },

  updateMultiIsbn: function(e) {
    let value = e.detail.value
    this.setData({
      multiIsbn: value
    })
  },
  /**
   * 同步输入数据
   */
  onInput: function (e) {
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
    this.getBookDetail(this.data.book.isbn).then(res=> {
      wx.hideLoading()
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
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
      wx.showModal({
        content: err,
        showCancel: false
      })
      _self.setData({
        showBookInfo: false
      })
    })
  },

  getBookDetail: function(isbn) {
    let _self = this
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://douban.uieee.com/v2/book/isbn/' + isbn,
        header: {
          'content-type': 'json'
        },
        success: res => {
          if(!_self.data.isMultiAdd){
            if (res.statusCode !== 200) {
              reject(res.data.msg);
            }else{
              resolve(res);
            }
          }else{
            if (res.statusCode !== 200) {
              let errList = _self.data.searchError
              errList.push(isbn)
              _self.setData({
                searchError: errList
              })
              resolve(`getBookDetailsuccess - fail: ${isbn}`)
            } else {
              let data = res.data
              let aData = {
                owner: 'web组',
                place: '9F B办公区靠窗',
                num: 1,
                borrowed_num: 0,
                author: data.author.join(' / '),
                author_intro: data.author_intro,
                image: data.image,
                title: data.title,
                publisher: data.publisher,
                translator: data.translator.join(' / '),
                tags: data.tags.join(' | '),
                content_intro: data.summary,
                isbn: isbn,
                isbn10: data.isbn10,
                isbn13: data.isbn13,
                catalog: data.catalog
              }
              resolve(_self.addBook(aData))
            }
          }
        },
        fail: err => {
          if (!_self.data.isMultiAdd) {
            reject('查询失败')
          } else {
            let errList = _self.data.searchError
            errList.push(isbn)
            _self.setData({
              searchError: errList
            })
            resolve(`getBookDetailfail - fail: ${isbn}`)
          }
        }
      })
    })
  },

  /**
   * 单个提交
  */
  singleAdd: function(e) {
    wx.showLoading()
    this.addBook(this.data.book).then(res => {
      wx.hideLoading()
      wx.navigateBack({
        url: '../list/list'
      }) 
    }).catch(err => {
      wx.hideLoading()
      wx.showModal({
        content: err.message,
        showCancel: false
      })
    })
  },

  /**
   * 添加书籍
   */
  addBook: function (aData) {
    let _self = this
    aData.status = "ONSHELF"
    
    return myRequest.call('book', {
      $url: "add",
      data: aData,
      isbn: aData.isbn
    }).then(res => {
      if(_self.data.isMultiAdd) {
        let saveList = _self.data.saveList
        saveList.push(aData.isbn)
        _self.setData({
          saveList: saveList
        })
      }
      return Promise.resolve(res)
    }, (err) => {
      if (!_self.data.isMultiAdd) {
        return Promise.reject(err)
      }else{
        let errList = _self.data.submitError
        errList.push(`${aData.isbn}: ${err.message}`)
        _self.setData({
          submitError: errList
        })
        return Promise.resolve(`addBook - fail:${aData.isbn}`)
      }
      
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

    wx.showLoading()
    myRequest.call('book', {
      $url: "edit",
      data: eData,
      bookId: _self.data.book._id
    }).then(res => {
      console.log(res)
      wx.hideLoading()

      wx.navigateBack({
        delta: 1
      })
    }).catch(err => {
      console.log(err)
      if (!app.checkLogin(err.code)) {
        return
      }
      wx.hideLoading()
      wx.showModal({
        content: err.message,
        showCancel: false
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
    aData.status = "PENDING"
    let rTime = new Date().getTime() / 1000
    let rDate = utils.formatTime(rTime, 'Y-M-D')
    let userId = wx.getStorageSync('userId')

    wx.showLoading()
    myRequest.call('book', {
      $url: "recommend",
      isbn: aData.isbn,
      data: aData,
      userId: userId,
      date: rDate
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      wx.navigateBack({
        url: '../list/list'
      })
    }).catch(err => {
      console.log(err)
      if (!app.checkLogin(err.code)) {
        return
      }
      wx.hideLoading()
      wx.showModal({
        content: err.message,
        showCancel: false
      })
    })
  },

  /**
   * 批量添加
   */
  multiAdd: function() {
    let isbns = this.data.multiIsbn.split([','])
    this.setData({
      searchError: [],
      submitError: [],
      saveList: []
    })
    wx.showLoading()
    Promise.all(
      isbns.map((item, i) => {
        item = item.trim()
        if (!item) {
          return;
        }
        setTimeout(() => {
          this.getBookDetail(item)
        }, i * 20 * Math.sqrt(i))
      })
    ).then(res=> {
      console.log(res)
      wx.hideLoading()
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  /**
   * 扫码识别
   */
  doScan: function () {
    let _self = this
    wx.scanCode({
      success: (res) => {
        let isbn = res.result
        this.setData({
          'book.isbn': isbn
        })
        this.search();
      },
      fail: (err) => {
        wx.showToast({
          title: err
        })
      }
    })
  }
})