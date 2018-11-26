// 云函数入口文件
let isTest = false
let options = {
  env: isTest ? "test-c3b399" : ''
}
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const MD5 = require("blueimp-md5")
const ADMIN_USER = 1
const COMMON_USER = 0

cloud.init()

const db = cloud.database(options)
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
          if (result.data && result.data[0] && type > userType) {
            ctx.body = {
              code: 403,
              message: 'Forbidden',
              result: result.data
            }
          } else if (result.data && result.data[0] && result.data[0].expireTime >= currentTime) {
            await next(result.data)
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
      } catch (e) {
        ctx.body = {
          code: 500,
          message: 'Internal Server Error'
        }
      }
    }
    return handleAuth
  }

  app.router('list', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let startIndex = event.startIndex || 0
      let size = event.size || 100
      let result = await db.collection('user').skip(startIndex).limit(size).field({
        username: true,
        userType: true,
        _id: true
      }).get()

      ctx.body = {
        code: 0,
        data: {
          list: result.data
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

  app.router('detail', checkAuth(ADMIN_USER), async (ctx) => {
    try {
      let result = await db.collection('user').doc(event.id).get()

      ctx.body = {
        code: 0,
        data: {
          user: result.data
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
      let user = event.data;
      let result1 = await db.collection('user').where({
        username: user.username
      }).count()

      if (result1.total > 0) {
        ctx.body = {
          code: 1001,
          data: {},
          message: '该用户名已存在'
        }
        return
      }
      
      user.password = MD5(user.password)
      let result2 = await db.collection('user').add({
          data: user
      })

      ctx.body = {
        code: 0,
        data: {},
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
      let result = await db.collection('user').doc(event.id).update({
        data: {
          remark: event.remark,
          userType: event.userType
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

  app.router('delete', currentData = checkAuth(ADMIN_USER), async (ctx) => {
    try {
      if(currentData.userId === event.id){
        ctx.body = {
          code: 1001,
          data: {},
          message: '该用户有未归还书籍，不能删除'
        }
        return
      }
      let result1 = await db.collection('borrow').where({
        userId: event.id,
        status: 0
      }).count();
      if (result1.total > 0) {
        ctx.body = {
          code: 1001,
          data: {},
          message: '不可以删除自己'
        }
      } else {
        let result2 = await db.collection('user').doc(event.id).remove()
        ctx.body = {
          code: 0,
          data: {},
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