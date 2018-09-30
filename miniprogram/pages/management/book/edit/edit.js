// miniprogram/pages/book/edit/edit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showBookInfo: false,
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
    if(!options.id){
      return
    }

    wx.setNavigationBarTitle({
      title: ('编辑图书'),
    })
    const db = wx.cloud.database();
    let _self = this

    this.setData({
      isEdit: true
    });
  
    db.collection('book').doc(options.id).get().then(res => {
      console.log(res);
      _self.setData({
        book: res.data,
       'book.isbn': res.data.isbn13,
      });
      
    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: '无法拉取图书信息',
      })
    })
  },

  onBlur: function (e) {
    console.log(e.currentTarget.id, e.detail.value)
    let key = e.currentTarget.id
    let value = e.detail.value

    let newData = this.data.book;
    newData[key] = value
    this.setData({
      book: newData
    })
  },

  search: function (e) {
    let _self = this;
    wx.showLoading()
    wx.request({
      url: 'https://douban.uieee.com/v2/book/isbn/' + this.data.isbn,
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

        let data = res.data;
        _self.setData({
          showBookInfo: true,
          'book.author': data.author.join('|'),
          'book.author_intro': data.author_intro,
          'book.image': data.image,
          'book.title': data.title,
          'book.publisher': data.publisher,
          'book.translator': data.translator.join(' | '),
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
  submitData: function(e) {
    let _self = this;
    const db = wx.cloud.database();
    let aData = this.data.book;
    db.collection('book').where({
      isbn10: aData.isbn10
    }).count().then(res => {
      console.log(res);
      // if(res.total > 0){
      //   wx.showModal({
      //     title: '提示',
      //     content: '该书目已存在',
      //   })
      //   return
      // }
      db.collection('book').add({
        data: aData
      }).then(res => {
        wx.showToast({
          title: '添加成功',
        })
        _self.setData({
          showBookInfo: false
        })
      }, (err) => {
        wx.showModal({
          title: '提示',
          content: '添加失败',
          showCancel: false
        })
      })
    }, err => {
      wx.showModal({
        title: '提示',
        content: '添加失败',
        showCancel: false
      })
    })
  },

  /**
   * 编辑
   */
  editData: function() {
    const db = wx.cloud.database()
    let _self = this

    let eData = Object.assign({}, _self.data.book)
    delete eData._openid
    delete eData.isbn
    delete eData._id
    delete eData.isbn10
    delete eData.isbn13

    console.log(eData)

    db.collection('book').doc(_self.data.book._id).update({
      data: eData
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
  }
})