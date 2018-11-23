// miniprogram/pages/user/edit/edit.js

const myRequest = require('../../../../api/myRequest')
const MD5 = require('../../../../utils/md5')
const app = getApp();
const defaultUser = {
  username: '',
  userType: 0,
  password: '123456',
  motto: 'Where there\'s a will there\'s a way. '
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTypeList:['普通用户', '管理员'],
    user: {},
    multiUser: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user: JSON.parse(JSON.stringify(defaultUser))
    })
    if (!options.id) {
      return
    }

    wx.setNavigationBarTitle({
      title: ('编辑用户'),
    })

    this.setData({
      isEdit: true
    })

    this.getUserInfo(options.id)
  },
  /**
   * 拉取用户详情
   */
  getUserInfo: function(id) {
    let _self = this
    wx.showLoading()
    myRequest.call('user', {
      $url: "detail",
      id: id
    }).then(res => {
      console.log(res)
      wx.hideLoading()
      _self.setData({
        user: res.user
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

  updateMultiUser: function (e) {
    let value = e.detail.value
    this.setData({
      multiUser: value
    })
  },

  /**
   * 切换添加方式
   */
  switchTap: function (e) {
    let type = e.currentTarget.id
    this.setData({
      isMultiAdd: type === 'multiAdd'
    })
  },


  /**
   * 同步表单数据
   */
  onInput: function (e) {
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
   *  单个新增
   */
  singleAdd: function (e) {
    let _self = this
    let aData = this.data.user
    if(!aData.username){
      wx.showModal({
        content: '用户名不能为空',
        showCancel: false
      })
      return;
    }
    wx.showLoading()
    this.addUser(aData).then(res => {
      wx.hideLoading()
      wx.navigateBack({
        url: '../list/list'
      })
        
    }).catch(err => {
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
   * 新增
   */
  addUser: function (data) {
    let _self = this
    let isMultiAdd = this.data.isMultiAdd
    let aData = JSON.parse(JSON.stringify(data))
    console.log('====',aData.password)
    aData.password = MD5(aData.password)
    console.log(aData.password)
    return myRequest.call('user', {
      $url: "add",
      data: aData
    }).then(res => {
      console.log(res)
      if (isMultiAdd) {
        let saveList = _self.data.saveList
        saveList.push(aData.username)
        _self.setData({
          saveList: saveList
        })
      }
      return Promise.resolve(res)
    }, err => {
      console.log(err)
      if (!isMultiAdd) {
        return Promise.reject(err);
      }else{
        let errList = _self.data.submitError
        errList.push(`${aData.username}: ${err.message}`)
        _self.setData({
          submitError: errList
        })
        return Promise.resolve(`addUser - fail:${aData.username}`)
      }
    })
  },

  /**
   * 编辑
   */
  editUser: function () {
    let _self = this

    let eData = Object.assign({}, _self.data.user)

    console.log(eData)

    wx.showLoading()
    myRequest.call('user', {
      $url: "edit",
      id: _self.data.user._id,
      remark: eData.remark,
      userType: eData.userType
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
   * 批量添加
   */
  multiAdd: function () {
    let users = this.data.multiUser.split([','])
    this.setData({
      submitError: [],
      saveList: []
    })
    wx.showLoading()
    Promise.all(
      users.map(item => {
        item = item.trim()
        if(!item){
          return;
        }
        let aData = JSON.parse(JSON.stringify(defaultUser))
        aData.username = item
        this.addUser(aData)
      })
    ).then(res => {
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