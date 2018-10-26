// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
const request = require('request')

cloud.init()

const db = cloud.database()
const _ = db.command

const requestSessionId = async (code) => {
  new Promise((resolve, reject) => {
    request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      json: true,
      qs: {
        grant_type: 'authorization_code',
        appid: 'wx5f2a0412d8fcaf91',
        secret: '9c20188d6c76e15a21dc0ec1d6b829ba',
        js_code: code
      }
    }, (err, response, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(body);
      }
    })
  })
}


// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({ event })

  
  app.router('login', async (ctx) => {
    try {
      let user = {}
      let result = await db.collection('user').where({
        username: event.user.username,
        password: event.user.password
      }).get()

      if(result.data && result.data.length > 0){
        user = result.data[0]
        let time = new Date().getTime()/1000 + 24*60*60
        let key = Math.random()

        // 清除其他session记录
        let result2 = await db.collection('session').where({
          userId: user._id,
          key: _.neq(key)
        }).remove()

        let result3 = await db.collection('session').add({
          data: {
            expireTime: time,
            userId: user._id,
            key: key
          }
        })
        ctx.body = {
          code: 0,
          data: {
            sessionId: result3._id,
            user: {
              userId: user._id,
              username: user.username,
              userType: user.userType
            }
          }
        }
        return
      }

      ctx.body = {
        code: 101,
        data: { result: result, user: user, length: result.data.length},
        message: '登录失败'
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: -1,
        data: e,
        message: '请求失败'
      }
    }
  })

  app.router('logout', async (ctx) => {
    try {
      ctx.body = {
        code: 0,
        data: {
          user: result.data
        }
      }
    } catch (e) {
      console.error(e)
      ctx.body = {
        code: -1,
        data: {},
        message: '请求失败'
      }
    }
  })

  return app.serve()
}