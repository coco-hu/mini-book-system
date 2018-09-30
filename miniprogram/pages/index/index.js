// miniprogram/pages/index/index.js
 const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    searchKey: '',
    currentSearchKey: '',
    hasLoadAll: false,
    showLoading: false,
    booklist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!wx.cloud){
      wx.redirectTo({
        url: '../chooseLib/chooseLib'
      })
      return
    }

    //默认显示图书信息，每次拉取20条
    this.pullBookInfo()
  },

  /**
   * 拉取更多图书信息
   */
  pullBookInfo : function (keyFlag) {
    const db = wx.cloud.database();
    const _ = db.command;
    const UNIT = 6;
    let records = db.collection('book');
    if(keyFlag){
      let key = this.data.searchKey;
      console.log(key);
      records = records.where(_.or([{
        title: key
      },{
        author: key
      },{
        isbn10: key
      },{
        isbn13: key
      }]))
    }
    if(this.data.currentIndex){
      records = records.skip(this.data.currentIndex);
    }
    records.limit(UNIT).field({
      author: true,
      image: true,
      title: true,
      _id: true,
      isbn13: true,
      available_num: true
    }).get().then(res => {
      this.setData({
        showLoading: false,
        booklist: this.data.booklist.concat(res.data),
        currentIndex: this.data.currentIndex + UNIT
      });
      if (!res.data || res.data.length < UNIT) {
        this.setData({
          hasLoadAll: true
        })
      }
    }).catch(err => {
      this.setData({
        showLoading: true
      })
      wx.showModal({
        content: '无法拉取图书信息',
      })
    })

  },
  /**
   * 保存搜索框的值
   */
  searchBlur: function(e){
    this.setData({
      currentSearchKey: e.detail.value
    })
  },

  /**
   * 搜索图书
   */
  search: function (e) {
    let key
    if(e.currentTarget.id === 'search'){
      key = e.detail.value;
    }else{
      key = this.data.currentSearchKey
    }
    this.setData({
      searchKey: key,
      currentIndex: 0,
      booklist: [],
      hasLoadAll: false
    });
    this.pullBookInfo(this.data.searchKey);
  },

  /**
   * 去书籍详情页
   */
  toBookDetail: function (e) {
    wx.navigateTo({
      url: `/pages/book/detail/detail?id=${e.currentTarget.id}`,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.hasLoadAll){
      return false;
    }
    this.setData({
      showLoading: true
    })
    this.pullBookInfo();
  }
})