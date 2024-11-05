import express from 'express'
import db from '##/configs/mysql.js'
import multer from 'multer'
const upload = multer()
const router = express.Router()
import jsonwebtoken from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'
import { compareHash } from '##/db-helpers/password-hash.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// 教師登入
router.post('/teacher-login', async (req, res, next) => {
  console.log(req.body)
  const teahcerLogin = req.body
  // 1. 先用 account 查詢該教師
  const [accountRows] = await db.query(
    'SELECT * FROM teachers WHERE account = ?',
    [teahcerLogin.account]
  )

  // 檢查是否存在該帳號
  if (accountRows.length === 0) {
    return res.json({ status: 'error', message: '該教師不存在' })
  }

  const dbTeacher = accountRows[0]

  // 2. 然後比對密碼
  if (dbTeacher.password !== teahcerLogin.password) {
    return res.json({ status: 'error', message: '密碼錯誤' })
  }

  // // 2. 比對密碼hash是否相同(返回true代表密碼正確)
  // const isValid = await compareHash(teahcerLogin.password, dbTeacher.password)

  // if (!isValid) {
  //   return res.json({ status: 'error', message: '密碼錯誤' })
  // }
  // console.log(dbUser)
  // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
  // 不能修改的資料，避免教師修改後又要重發
  const returnTeacher = {
    id: dbTeacher.id,
    account: dbTeacher.account,
  }

  // 讓教師保持登陸3天(在看你要設定幾天~他會保持登入狀態)
  // 產生存取令牌(access token)，其中包含教師資料
  const accessTeacherToken = jsonwebtoken.sign(
    returnTeacher,
    accessTokenSecret,
    {
      expiresIn: '3d',
    }
  )

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessTeacherToken', accessTeacherToken, { httpOnly: true })

  // 傳送access token回應(例如react可以儲存在state中使用)
  return res.json({
    status: 'success',
    data: { accessTeacherToken },
  })
  // return res.json({ status: 'success', data: null })
})

// 教師登出
router.post('/teacher-logout', (req, res) => {
  // 清除cookie
  res.clearCookie('accessTeacherToken', { httpOnly: true })
  res.json({ status: 'success', data: null })
})

export default router
