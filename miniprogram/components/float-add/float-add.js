// components/float-add/float-add.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    linkUrl: {
      type: String,
      value: ''
    },
    maxLeft: {
      type: Number,
      value: 10,
    },
    maxTop: {
      type: Number,
      value: 10
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    top: 10,
    left: 10,
    maxLeft: 0,
    maxTop: 0
  },

  /**
   * 生命周期函数
   */
  lifetimes: {
    attached: function() {
      let maxLeft = wx.getSystemInfoSync().windowWidth - 54 - 10
      let maxTop = wx.getSystemInfoSync().windowHeight - 54 - 10

      this.setData({
        maxLeft: maxLeft,
        maxTop: maxTop,
        top: maxTop,
        left: maxLeft
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //去添加项目的页面
    toAddPage: function () {
      wx.navigateTo({
        url: this.data.linkUrl,
      })
    },
    // 浮动按钮拖动
    setTouchMove: function (e) {
      let maxLeft = this.data.maxLeft
      let maxTop = this.data.maxTop

      let x = e.touches[0].clientX - 30
      x = x < 0 ? 10 : (x > maxLeft ? maxLeft : x)
      let y = e.touches[0].clientY - 30
      y = y < 0 ? 10 : (y > maxTop ? maxTop : y)

      this.setData({
        left: x,
        top: y
      })
    },

  }
})
