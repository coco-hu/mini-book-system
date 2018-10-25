/**
 * 云函数接口
 */
let call = (name, data) => {
  return wx.cloud.callFunction({
    name,
    data
  }).then(res => {
    let result = res.result
    if(result && result.code === 0){
      return Promise.resolve(result.data)
    }
    return Promise.reject(result)
  }, err => {
    return Promise.reject(err)
  })
} 

module.exports = {
  call
}