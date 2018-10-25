// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  let tTime = new Date().getTime() / 1000 + 100 * 24 * 60 * 60

  try {
    let promise1 = db.collection('borrow').where({
      userId: event.userId,
      status: event.status
    }).count()
    let promise2 = db.collection('borrow').where({
      userId: event.userId,
      status: event.status,
      expire_time: _.lt(event.expire_time)
    }).count()
    let promise3 = db.collection('recommend').where({
      userId: event.userId
    }).count()
    let result = await Promise.all([promise1, promise2, promise3])
    return {
      borrowNum: result[0].total,
      expiredNum: result[1].total,
      recommendNum: result[2].total
    }
  }catch(e) {
    console.error(e)
    return {}
  }
}