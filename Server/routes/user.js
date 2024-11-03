import express from 'express'
import db from '##/configs/mysql.js'
import multer from 'multer'
const upload = multer()
const router = express.Router()
import { generateHash } from '#db-helpers/password-hash.js'
import jsonwebtoken from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'

// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/', authenticate, async function (req, res) {
  // id可以用jwt的存取令牌(accessToken)從authenticate中得到(如果有登入的話)
  const id = req.user.id

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  const [rows] = await db.query('SELECT * FROM user WHERE id= ?', [id])

  if (rows.length === 0) {
    return res.json({ status: 'error', message: '沒有找到會員資料' })
  }

  const user = rows[0]

  // 不回傳密碼
  delete user.password

  return res.json({ status: 'success', data: { user } })
})

// 註冊
router.post('/', upload.none(), async (req, res, next) => {
  try {
    const { email, password, name, account } = req.body

    // 2. 看解構後的值
    console.log('解構後的值:', {
      email,
      password,
      name,
      account,
    })

    // 3. 特別檢查 password
    console.log('password 型別:', typeof password)
    console.log('password 長度:', password ? password.length : 'undefined')

    // 如果有值就執行插入
    if (!password) {
      throw new Error('密碼未接收到')
    }

    // 4. 看要執行的 SQL 值
    console.log('準備插入的值:', [email, password, name, account])
    // 檢查是否已經有相同的email
    console.log('開始資料庫操作')
    // 帳號密碼重複認證
    const [existingUser] = await db.query(
      'SELECT * FROM user WHERE email = ? OR account = ?',
      [email, account]
    )

    if (existingUser.length > 0) {
      return res.json({
        status: 'error',
        message: '電子郵件或帳號已被註冊',
      })
    }

    const hashedPassword = await generateHash(password)

    const sql = `
      INSERT INTO user (
      name , account, password, gender, phone, email, address, img, level, created_at, updated_at
      ) VALUES (
       ?, ?, ?,' ',' ', ?,' ',' ','1',Now(),'');
    `
    const params = [
      name,
      account,
      email,
      hashedPassword, // 使用加密後的密碼
      // phone,
      // birthdate || null,
      // gender,
    ]

    const [result] = await db.query(sql, params)
    console.log('插入結果:', result)

    if (result.affectedRows === 1) {
      // 成功插入
      return res.json({
        status: 'success',
        message: '註冊成功',
        userId: result.insertId, // 取得新插入的 id
      })
    } else {
      throw new Error('資料插入失敗')
    }
  } catch (error) {
    console.error('SQL Error:', error)
    return res.status(500).json({
      status: 'error',
      message: error.message || '伺服器錯誤',
    })
  }
})

// 登入
router.post('/login', async (req, res, next) => {
  console.log(req.body)
  const loginUser = req.body
  const [rows] = await db.query(
    'SELECT * FROM user WHERE account = ? AND password = ?',
    [loginUser.account, loginUser.password]
  )

  if (rows.length === 0) {
    return res.json({ status: 'error', message: '帳號或密碼錯誤' })
  }
  const dbUser = rows[0]
  // console.log(dbUser)
  // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
  // 不會修改的資料，避免使用者修改後又要重發
  const returnUser = {
    id: dbUser.id,
    account: dbUser.account,
    // google_uid: user.google_uid,
    // line_uid: user.line_uid,
  }

  // 讓會員保持登陸3天
  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, { httpOnly: true })

  // 傳送access token回應(例如react可以儲存在state中使用)
  return res.json({
    status: 'success',
    data: { accessToken },
  })
  // return res.json({ status: 'success', data: null })
})
// 登出
router.post('/logout', authenticate, (req, res) => {
  // 清除cookie
  res.clearCookie('accessToken', { httpOnly: true })
  res.json({ status: 'success', data: null })
})

export default router
