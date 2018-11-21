
const db = wx.cloud.database()
const _ = db.command

let searchBook = (event) => {
  let records = db.collection('book')
  if (event.keyFlag) {
    let key = event.key
    records = records.where(_.or([{
      title: key
    }, {
      author: key
    }, {
      isbn10: key
    }, {
      isbn13: key
    }]))
  }
  if (event.startIndex) {
    records = records.skip(event.startIndex)
  }
  try{
    return records.limit(event.size).where({
      status: _.in(['ONSHELF'])
    }).field({
      author: true,
      image: true,
      title: true,
      _id: true,
      isbn13: true,
      num: true,
      borrowed_num: true
    }).get().then(res => {
      return Promise.resolve({
        list: res.data
      })
    }).catch(err => {
      return Promise.reject({
        code: -2,
        message: '操作失败',
        err: err
      })
    })
  }catch(e){
    console.log(e)
    return Promise.reject({
      code: -1,
      message:'请求失败'
    })
  }
}

let searchIsbn = (event) => {
  try {
    return db.collection('book').where(_.or([{
      isbn10: event.isbn
    }, {
      isbn13: event.isbn
    }])).get().then(res => {
      if (res.data && res.data.length > 0 && res.data[0]._id) {
        return Promise.resolve({
          id: res.data[0]._id
        })
      } else {
        return Promise.reject({
          code: -2,
          message: '该书目不存在'
        })
      }
    }).catch(err => {
      return Promise.reject({
        code: -2,
        message: '操作失败'
      })
    })
  } catch (e) {
    console.log(e)
    return Promise.reject({
      code: -1,
      message: '请求失败'
    })
  }
}

let getBookDetail = (event) => {
  try {
    return db.collection('book').doc(event.id).get().then(res => {
      return Promise.resolve({
        book: res.data
      })
    }).catch(err => {
      return Promise.reject({
        code: -2,
        message: '操作失败'
      })
    })
    
  } catch (e) {
    return Promise.reject({
      code: -1,
      message: '请求失败'
    })
  }
}
module.exports = {
  searchBook,
  searchIsbn,
  getBookDetail,
}