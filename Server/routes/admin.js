import express from 'express'
import db from '##/configs/mysql.js'
const router = express.Router()
import jsonwebtoken from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

router.get('/', async (req, res) => {
  console.log(req.body)
  // const adminLogin = req.body
  // 1. 先用 account 查詢該管理員
  const [accountRows] = await db.query('SELECT * FROM admin')
  console.log(accountRows)
})

// 管理員登入
router.post('/admin-login', async (req, res, next) => {
  console.log(req.body)
  const adminLogin = req.body
  // 1. 先用 account 查詢該管理員
  const [accountRows] = await db.query(
    'SELECT * FROM admin WHERE account = ?',
    [adminLogin.account]
  )

  // 檢查是否存在該帳號
  if (accountRows.length === 0) {
    return res.json({ status: 'error', message: '該管理員不存在' })
  }

  const dbAdmin = accountRows[0]

  // 2. 然後比對密碼
  if (dbAdmin.password !== adminLogin.password) {
    return res.json({ status: 'error', message: '密碼錯誤' })
  }

  // // 2. 比對密碼hash是否相同(返回true代表密碼正確)
  // const isValid = await compareHash(adminLogin.password, dbAdmin.password)

  // if (!isValid) {
  //   return res.json({ status: 'error', message: '密碼錯誤' })
  // }
  // console.log(dbUser)
  // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
  // 不能修改的資料，避免管理員修改後又要重發
  const returnAdmin = {
    id: dbAdmin.id,
    account: dbAdmin.account,
  }

  // 讓管理員保持登陸1天(在看你要設定幾天~他會保持登入狀態)
  // 產生存取令牌(access token)，其中包含管理員資料
  const accessAdminToken = jsonwebtoken.sign(returnAdmin, accessTokenSecret, {
    expiresIn: '1d',
  })

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessAdminToken', accessAdminToken, { httpOnly: true })

  // 傳送access token回應(例如react可以儲存在state中使用)
  return res.json({
    status: 'success',
    data: { accessAdminToken },
  })
  // return res.json({ status: 'success', data: null })
})

// 管理員登出
router.post('/admin-logout', (req, res) => {
  // 清除cookie
  res.clearCookie('accessAdminToken', { httpOnly: true })
  res.json({ status: 'success', data: null })
})

export default router
