import express from 'express'
import db from '##/configs/mysql.js'
import multer from 'multer'
const upload = multer()
const router = express.Router()
import { generateHash } from '#db-helpers/password-hash.js'

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

    const [existingUser] = await db.query(
      'SELECT * FROM user WHERE email = ?',
      [email]
    )

    if (existingUser.length > 0) {
      return res.json({
        status: 'error',
        message: '電子郵件已被註冊',
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

export default router
