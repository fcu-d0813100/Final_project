import express from 'express'
import db from '##/configs/mysql.js'
// import multer from 'multer'
// const upload = multer()
const router = express.Router()
// import jsonwebtoken from 'jsonwebtoken'
// // 中介軟體，存取隱私會員資料用
// import authenticate from '#middlewares/authenticate.js'
// import { compareHash } from '##/db-helpers/password-hash.js'

// // 定義安全的私鑰字串
// const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// // 教師登入
// router.post('/teacher-login', async (req, res) => {
//   console.log(req.body)
//   const teahcerLogin = req.body
//   // 1.先用account查詢該教師
//   const [rows] = await db.query('SELECT * FROM teachers WHERE account = ?', [
//     teahcerLogin.account,
//   ])

//   if (rows.length === 0) {
//     return res.json({ status: 'error', message: '該教師不存在' })
//   }

//   const dbTeacher = rows[0]

//   // 2. 比對密碼hash是否相同(返回true代表密碼正確)
//   const isValid = await compareHash(teahcerLogin.password, dbTeacher.password)
//   if (!isValid) {
//     return res.json({ status: 'error', message: '教師密碼錯誤' })
//   }
//   // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
//   // 不能修改的資料，避免教師修改後又要重發
//   const returnTeacher = {
//     id: dbTeacher.id,
//     account: dbTeacher.account,
//   }

//   // 讓教師保持登陸3天(在看你要設定幾天~他會保持登入狀態)
//   // 產生存取令牌(access token)，其中包含教師資料
//   const accessTeacherToken = jsonwebtoken.sign(
//     returnTeacher,
//     accessTokenSecret,
//     {
//       expiresIn: '3d',
//     }
//   )

//   // 使用httpOnly cookie來讓瀏覽器端儲存access token
//   res.cookie('accessTeacherToken', accessTeacherToken, { httpOnly: true })

//   // 傳送access token回應(例如react可以儲存在state中使用)
//   return res.json({
//     status: 'success',
//     data: { accessTeacherToken },
//   })
//   // return res.json({ status: 'success', data: null })
// })

// // 教師登出
// router.post('/teacher-logout', authenticate, (req, res) => {
//   // 清除cookie
//   res.clearCookie('accessTeacherToken', { httpOnly: true })
//   res.json({ status: 'success', data: null })
// })

router.get('/', async function (req, res) {
  const sqlSelect = `SELECT
  teachers.id,
  teachers.name,
  teachers.gender,
  teachers.years,
  teachers.nation,
  teachers.valid,
  workshop_type.type AS workshop_type_type

 FROM
    teachers
 JOIN
    workshop_type ON workshop_type.id = teachers.type_id `

  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
  console.log(req.params)
})

router.get('/:tid', async function (req, res) {
  const sqlSelect = `SELECT
  teachers.*,
  workshop.id AS workshop_id,
  workshop_type.type AS workshop_type_type,
  workshop.name AS workshop_name,
  workshop.price As workshop_price,
  workshop.registration_start AS workshop_registration_start,
  workshop.registration_end AS workshop_registration_end,
  GROUP_CONCAT(workshop_time.date ORDER BY workshop_time.date ASC) AS dates


 FROM
    teachers
 JOIN
    workshop_type ON workshop_type.id = teachers.type_id
 LEFT JOIN
    workshop ON workshop.teachers_id = teachers.id   
 LEFT JOIN
    workshop_time ON workshop_time.workshop_id = workshop.id
 WHERE
    teachers.id=${req.params.tid}
  GROUP BY
    workshop.id, teachers.id, workshop.isUpload, workshop.valid, workshop_type.id `

  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
  console.log(req.params.tid)
})

router.get('/information/:tid', async function (req, res) {
  const sqlSelect = `SELECT
  teachers.*
 FROM
    teachers
 WHERE
    teachers.id=${req.params.tid}`

  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
  console.log(req.params.tid)
})

export default router
