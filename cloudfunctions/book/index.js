// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const MD5 = require("blueimp-md5")
const ADMIN_USER = 1
const COMMON_USER = 0

cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  const checkAuth = (type) => {
    type = type || 0
    const handleAuth = async (ctx, next) => {
      try {
        let result = {}
        if (event.sessionId) {
          let currentTime = new Date().getTime() / 1000
          result = await db.collection('session').where({
            key: MD5(event.sessionId),
          }).get()
          let userType = result.data && result.data[0] && result.data[0].userType || 0
          if (result.data && result.data[0] && type > userType){
            ctx.body = {
              code: 403,
              message: 'Forbidden',
              result: result.data
            }
          } else if (result.data && result.data[0] && result.data[0].expireTime >= currentTime) {
            await next()
          } else {
            ctx.body = {
              code: 401,
              message: 'Unauthorized',
              result: result.data
            }
          }
        } else {
          ctx.body = {
            code: 401,
            message: 'Unauthorized',
            result: result
          }
        }
        return
      }catch(e){
        ctx.body = {
          code: 500,
          message: 'Internal Server Error'
        }
      }
    }
    return handleAuth
  }

  app.router('search', async (ctx) => {
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
    try {
      let result = await records.limit(event.size).where({
        status: _.in(['ONSHELF'])
      }).field({
        author: true,
        image: true,
        title: true,
        _id: true,
        isbn13: true,
        num: true,
        borrowed_num: true
      }).get()

      ctx.body = {
        code: 0,
        data: {
          list:result.data
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('search-isbn', async (ctx) => {
    try {
      let result = await db.collection('book').where(_.or([{
        isbn10: event.isbn
      }, {
        isbn13: event.isbn
      }])).get()

      if (result.data && result.data.length > 0 && result.data[0]._id){
        ctx.body = {
          code: 0,
          data: {
            id: result.data[0]._id
          }
        }
      } else {
        ctx.body = {
          code: 1001,
          data: {},
          message: '该书目不存在'
        }
      }
      
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('detail', async (ctx) => {
    try {
      let result = await db.collection('book').doc(event.id).get()
      // 检查是否为已借书籍
      let result2 = await db.collection('borrow').where({
        bookId: event.id,
        userId: event.userId,
        status: 0
      }).count()

      ctx.body = {
        code: 0,
        data: {
          book: result.data,
          isBorrowed: result2.total > 0
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })


  app.router('count-sum', checkAuth(COMMON_USER), async (ctx) => {
    try {
      let tTime = new Date().getTime() / 1000

      let result1 = await db.collection('borrow').where({
        userId: event.userId,
        status: event.status
      }).count()

      let result2 = await db.collection('borrow').where({
        userId: event.userId,
        status: event.status,
        expire_time: _.lt(tTime)
      }).count()

      let result3 = await db.collection('recommend').where({
        userId: event.userId
      }).count()

      ctx.body = {
        code: 0,
        data: {
          borrowNum: result1.total,
          expiredNum: result2.total,
          recommendNum: result3.total
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('borrow-list', checkAuth(COMMON_USER), async (ctx) => {
    try {
      let borrowArr = []
      let bidArr = []
      let resultData = []
      let result = await db.collection('borrow').where({
        userId: event.userId,
        status: event.status
      }).get()

      borrowArr = result.data
      for (let i = 0; i < borrowArr.length; i++) {
        bidArr.push(borrowArr[i].bookId)
      }

      if (bidArr.length > 0) {
        let result2 = await db.collection('book').where({
          _id: _.in(bidArr)
        }).get()

        let data = []
        let bookArr = result2.data
        for (let i = 0, j = 0; i < borrowArr.length; i++) {
          for (j = 0; j < bookArr.length; j++) {
            if (borrowArr[i].bookId === bookArr[j]._id) {
              data.push(Object.assign({
                titleLength: bookArr[j].title.replace(/[^\u0000-\u00ff]/g, "aa").length
              }, bookArr[j], borrowArr[i]))
              break
            }
          }
        }
        resultData = data
      }
      ctx.body = {
        code: 0,
        data: {
          list: resultData
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('borrow', checkAuth(COMMON_USER), async (ctx) => {
    try {
      let result = await db.collection('borrow').where({
        bookId: event.borrowData.bookId,
        userId: event.borrowData.userId,
        status: 0
      }).count()
      if (result.total > 0){
        ctx.body = {
          code : 1001,
          message: '不可重复借阅'
        }
      }else{
        let result1 = await db.collection('borrow').add({
          data: event.borrowData
        })
        let result2 = await db.collection('book').doc(event.borrowData.bookId).update({
          data: {
            borrowed_num: _.inc(1)
          },
        })
        ctx.body = {
          code: 0,
          data: {}
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('renew', checkAuth(COMMON_USER), async (ctx) => {
    try {
      let result = await db.collection('borrow').doc(event.id).update({
        data: {
          expire_date: event.expire_date,
          expire_time: event.expire_time
        }
      })
      ctx.body = {
        code: 0,
        data: {}
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('return', checkAuth(COMMON_USER), async (ctx) => {
    try {
      let result1 = await db.collection('borrow').doc(event.borrowId).update({
        data: {
          status: 1,
          end_date: event.end_date,
          end_time: event.end_time
        }
      })
      let result2 = await db.collection('book').doc(event.bookId).update({
        data: {
          borrowed_num: _.inc(-1)
        }
      })
      ctx.body = {
        code: 0,
        data: {}
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('recommend-list', checkAuth(COMMON_USER), async (ctx) => {
    try {
      let resultData = []
      let bookIdArr = []
      let result1 = await db.collection('recommend').where({
        userId: event.userId,
      }).get()

      let recommendArr = result1.data
      for (let i = 0; i < recommendArr.length; i++) {
        bookIdArr.push(recommendArr[i].bookId)
      }

      if (bookIdArr.length > 0) {
        let result2 = await db.collection('book').where({
          _id: _.in(bookIdArr)
        }).get()
        resultData = result2.data
      }
      ctx.body = {
        code: 0,
        data:{
          list: resultData
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('all-recommend-list', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let resultData = []
      let bookIdArr = []
      let userIdArr = []
      let recommendArr = []
      
      let result1 = await db.collection('recommend').get()
      recommendArr = result1.data
      for (let i = 0; i < recommendArr.length; i++) {
        bookIdArr.push(recommendArr[i].bookId)
        userIdArr.push(recommendArr[i].userId)
      }

      if (bookIdArr.length > 0 && userIdArr.length > 0) {
        let result2 = await db.collection('user').where({
          _id: _.in(userIdArr)
        }).field({
          _id: true,
          username: true
        }).get()
        let result3 = await db.collection('book').where({
          _id: _.in(bookIdArr),
        }).get()

        let userArr = result2.data
        let bookArr = result3.data
        recommendArr = recommendArr.map(item => {
          let data = {}
          for (let i = 0; i < userArr.length; i++) {
            if (item.userId === userArr[i]._id) {
              Object.assign(data, userArr[i], item)
            }
          }
          for (let i = 0; i < bookArr.length; i++) {
            if (item.bookId === bookArr[i]._id) {
              Object.assign(data, bookArr[i], item)
            }
          }
          return data
        })
      }

      ctx.body = {
        code: 0,
        data: {
          list: recommendArr
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('recommend', checkAuth(COMMON_USER), async (ctx) => {
    try {
      let result1 = await db.collection('book').where({
        isbn: event.isbn
      }).count()

      if (result1.total > 0) {
        ctx.body = {
          code: 1001,
          data: {},
          message: '该书目已存在/正被推荐'
        }
        return
      }
      let result2 = await db.collection('book').add({
        data: event.data
      })
          
      let result3 = await db.collection('recommend').add({
        data: {
          bookId: result2._id,
          userId: event.userId,
          date: event.date
        }
      })
  
      ctx.body = {
        code: 0,
        data: {}
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('recommend-agree', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let result = await db.collection('book').doc(event.id).update({
        data: {
          status: 'BUYING'
        }
      })
      ctx.body = {
        code: 0,
        data: {}
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('recommend-reject', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let result = await db.collection('book').doc(event.id).update({
        data: {
          status: 'REJECTED'
        }
      })
      ctx.body = {
        code: 0,
        data: {}
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('recommend-on-shelf', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let result = await db.collection('book').doc(event.id).update({
        data: {
          status: 'ONSHELF'
        }
      })
      ctx.body = {
        code: 0,
        data: {}
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('booklist', checkAuth(COMMON_USER), async (ctx) => {
    try {
      let result = await db.collection('book').field({
        title: true,
        author: true,
        _id: true
      }).get()

      let data = result.data.map(item => {
        item.titleLength = item.title && item.title.replace(/[^\u0000-\u00ff]/g, "aa").length || 0
        item.author = item.author && item.author.split('/').length > 1 && item.author.split('/')[0] + '等' || item.author
        return item
      })
      ctx.body = {
        code: 0,
        data: {
          list: data
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('add', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let result1 = await db.collection('book').where({
        isbn: event.isbn
      }).count()

      if(result1.total > 0){
        ctx.body = {
          code: 1001,
          data: {},
          message: '该书目已存在'
        }
        return
      } 
      let result2 = await db.collection('book').add({
        data: event.data
      })
      ctx.body = {
        code: 0,
        data: {}
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('edit', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let result = await db.collection('book').doc(event.bookId).update({
        data: event.data
      })
      ctx.body = {
        code: 0,
        data: {}
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('delete', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let result1 = await db.collection('borrow').where({
        bookId: event.id,
        status: 0
      }).count();
      if(result1.total > 0){
        ctx.body = {
          code: -2,
          data: {},
          message: '未归还书籍，不能删除'
        }
      }else {
        let result2 = await db.collection('book').doc(event.id).remove()
        ctx.body = {
          code: 0,
          data: {}
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('overdue-list', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let bidArr = []
      let userIdArr = []
      let userArr = []
      let borrowArr = []
      let bookArr = []
      let tTime = new Date().getTime() / 1000

      let result1 = await db.collection('borrow').where({
        status: 0,
        expire_time: _.lt(tTime)
      }).get()
        
      borrowArr = result1.data
      for (let i = 0; i < borrowArr.length; i++) {
        bidArr.push(borrowArr[i].bookId)
        userIdArr.push(borrowArr[i].userId)
      }

      if (bidArr.length > 0 && userIdArr.length > 0) {
        let result2 = await db.collection('user').where({
          _id: _.in(userIdArr)
        }).field({
          _id: true,
          username: true
        }).get()
        let result3 = await db.collection('book').where({
          _id: _.in(bidArr),
        }).get()
        
        let userArr = result2.data
        let bookArr = result3.data
        borrowArr = borrowArr.map(item => {
          let data = {}
          for (let i = 0; i < userArr.length; i++) {
            if (item.userId === userArr[i]._id) {
              Object.assign(data, userArr[i], item)
            }
          }
          for (let i = 0; i < bookArr.length; i++) {
            if (item.bookId === bookArr[i]._id) {
              Object.assign(data, bookArr[i], item)
            }
          }
          data.overdue_days = Math.floor((tTime - data.expire_time) / (24 * 60 * 60))
          return data
        })
      }
     
      ctx.body = {
        code: 0,
        data: {
          list: borrowArr
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })

  app.router('all-borrow-list', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let bidArr = []
      let userIdArr = []
      let userArr = []
      let borrowArr = []
      let bookArr = []

      let result1 = await db.collection('borrow').where({
        status: 0
      }).get()

      borrowArr = result1.data
      for (let i = 0; i < borrowArr.length; i++) {
        bidArr.push(borrowArr[i].bookId)
        userIdArr.push(borrowArr[i].userId)
      }

      if (bidArr.length > 0 && userIdArr.length > 0) {
        let result2 = await db.collection('user').where({
          _id: _.in(userIdArr)
        }).field({
          _id: true,
          username: true
        }).get()
        let result3 = await db.collection('book').where({
          _id: _.in(bidArr),
        }).get()

        let userArr = result2.data
        let bookArr = result3.data
        borrowArr = borrowArr.map(item => {
          let data = {}
          for (let i = 0; i < userArr.length; i++) {
            if (item.userId === userArr[i]._id) {
              Object.assign(data, userArr[i], item)
            }
          }
          for (let i = 0; i < bookArr.length; i++) {
            if (item.bookId === bookArr[i]._id) {
              Object.assign(data, bookArr[i], item)
            }
          }
          return data
        })
      }

      ctx.body = {
        code: 0,
        data: {
          list: borrowArr
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: 500,
        message: 'Internal Server Error'
      }
    }
  })
  return app.serve()
}