/**
 * 云函数接口
 */
let call = (name, data) => {

  // wx.setStorageSync('sessionId', res.session_key)
  // wx.setStorageSync('userId', res.user.id)
  // wx.setStorageSync('username', res.user.username)

  data.sessionId = wx.getStorageSync('sessionId')
  console.log("myReques params: ", name, data.$url, data)
  return wx.cloud.callFunction({
    name,
    data
  }).then(res => {
    console.log("myReques: ", res)
    let result = res.result
    if(result && +result.code === 0){
      return Promise.resolve(result.data)
    } else {
      return Promise.reject(result)
    }
  }, err => {
    return Promise.reject(err)
  })
} 

module.exports = {
  call
}