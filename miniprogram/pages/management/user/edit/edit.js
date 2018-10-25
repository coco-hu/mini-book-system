// miniprogram/pages/user/edit/edit.js

const myRequest = require('../../../../api/myRequest')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTypeList:['普通用户', '管理员'],
    user: {
      userType: 0,
      password: '123456',
      motto: '学如才识，不日进，则日退。'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.id) {
      return
    }

    wx.setNavigationBarTitle({
      title: ('编辑用户'),
    })
    let _self = this

    this.setData({
      isEdit: true
    })
    myRequest.call('user', {
      $url: "detail",
      id: options.id
    }).then(res => {
      console.log(res)
      _self.setData({
        user: res.user
      })
    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: '无法拉取用户信息',
      })
    })
  },

  /**
   * 同步表单数据
   */
  onBlur: function (e) {
    let key = e.currentTarget.id
    let value = e.detail.value

    let newData = this.data.user
    newData[key] = value
    this.setData({
      user: newData
    })
  },

  /**
   * 用户类型选择
   */
  bindUserTypeChange: function (e) {
    this.setData({
      'user.userType': +e.detail.value
    })
  },

  /**
   * 新增
   */
  addUser: function (e) {
    let _self = this
    let aData = this.data.user
    
    myRequest.call('user', {
      $url: "add",
      data: aData
    }).then(res => {
      console.log(res)
      wx.showToast({
        title: '添加成功',
        complete: () => {
          setTimeout(()=> {
            wx.navigateBack({
              url: '../list/list'
            })
          }, 1000)
        }
      })
    }, err => {
      console.log(err)
      wx.showModal({
        title: '提示',
        content: err.message,
        showCancel: false
      })
    })
  },

  /**
   * 编辑
   */
  editUser: function () {
    let _self = this

    let eData = Object.assign({}, _self.data.user)

    console.log(eData)

    myRequest.call('user', {
      $url: "edit",
      id: _self.data.user._id,
      remark: eData.remark,
      userType: eData.userType
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