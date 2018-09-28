// miniprogram/pages/book/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {
      id: 1,
      title: '测试用书',
      author: 'coco',
      translator: '胡露',
      publisher: '富途出版社',
      available_num: 2,
      image: '/images/b2.jpg',
      isbn: '2847293793',
      place: '9F/web组后面',
      content_intro: '《JavaScript ES6函数式编程入门经典》使用JavaScript ES6带你学习函数式编程。你将学习柯里化、偏函数、高阶函数以及Monad等概念。目前，编程语言已经将焦点从对象转移到函数。JavaScript支持函数式编程，并允许开发者编写精心设计的代码。',
      author_intro: 'Anto Aravinth 是来自VisualBI Chennai 研发中心的高级商业智能开发工程师。在过去的五年中，他曾使用Java、JavaScript 语言以及ReactJs、Angular 等框架开发Web 应用。他对Web 和Web 标准有透彻的理解。他也是流行框架ReactJs、Selenium 和Groovy 的开源贡献者。Anto Aravinth 在业余时间喜欢打乒乓球。他很有幽默感！他也是React Quickly 一书的技术开发编辑，此书在2017 年由Manning 出版社出版。',
      catalog: '第1章　函数式编程简介 1 1.1 什么是函数式编程？为何它重要 1 1.2 引用透明性 4 1.3 命令式、声明式与抽象 5 1.4 函数式编程的好处 7 1.5 纯函数 7'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '测试用书',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  borrowBook: function () {
    wx.showModal({
      title: '提示',
      content: '确认借阅',
      success: function(res) {
        if(res.confirm) {
          console.log('点击确定')
        }
      }
    })
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