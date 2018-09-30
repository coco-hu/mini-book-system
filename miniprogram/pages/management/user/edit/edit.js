// miniprogram/pages/user/edit/edit.js

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
    const db = wx.cloud.database();
    let _self = this

    this.setData({
      isEdit: true
    });

    db.collection('user').doc(options.id).get().then(res => {
      console.log(res);
      _self.setData({
        user: res.data
      });

    }).catch(err => {
      console.log(err)
      wx.showModal({
        content: '无法拉取用户信息',
      })
    })
  },

  onBlur: function (e) {
    let key = e.currentTarget.id
    let value = e.detail.value

    let newData = this.data.user;
    newData[key] = value
    this.setData({
      user: newData
    })
  },

  bindUserTypeChange: function (e) {
    this.setData({
      'user.userType': +e.detail.value
    });
  },


  submitData: function (e) {
    let _self = this;
    const db = wx.cloud.database();
    let aData = this.data.user;
    
    db.collection('user').where({
      username: aData.username
    }).count().then(res => {
      console.log(res);
      if(res.total > 0){
        wx.showModal({
          title: '提示',
          content: '用户名已存在',
        })
        return
      }
      db.collection('user').add({
        data: aData
      }).then(res => {
        wx.showToast({
          title: '添加成功',
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
  editData: function () {
    const db = wx.cloud.database()
    let _self = this

    let eData = Object.assign({}, _self.data.user)

    console.log(eData)

    db.collection('user').doc(_self.data.user._id).update({
      data: {
        remark: eData.remark,
        userType: eData.userType
      }
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