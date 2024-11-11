import express from 'express'
import db from '##/configs/mysql.js'

const router = express.Router()

// import sequelize from '#configs/db.js'
// const { User } = sequelize.models

import jsonwebtoken from 'jsonwebtoken'
// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

router.post('/', async function (req, res) {
  const providerData = req.body
  console.log(JSON.stringify(providerData))

  // 檢查從react來的資料
  if (!providerData.providerId || !providerData.uid) {
    return res.json({
      status: 'error',
      message: '缺少google登入資料',
      code: '400',
    })
  }

  const { displayName, email, uid, photoURL } = providerData
  const google_uid = uid
  // const isFound = await count('user', { google_uid: providerData.uid })

  // 以下流程:
  // 1. 先查詢資料庫是否有同google_uid的資料
  // 2-1. 有存在 -> 執行登入工作
  // 2-2. 不存在 -> 建立一個新會員資料(無帳號與密碼)，只有google來的資料 -> 執行登入工作

  // 1. 先查詢資料庫是否有同google_uid的資料
  // const total = await User.count({
  //   where: {
  //     google_uid,
  //   },
  // })

  try {
    // 查詢資料庫中是否已存在相同的 google_uid
    const [rows] = await db.execute(
      'SELECT COUNT(*) AS count FROM user WHERE google_uid = ?',
      [google_uid]
    )
    const total = rows[0].count

    // 要加到access token中回傳給前端的資料
    // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
    let returnUser = {
      id: 0,
      name: '',
      google_uid: '',
      line_uid: '',
    }
    console.log(returnUser)

    if (total) {
      // 2-1. 如果已存在 -> 從資料庫取得會員資料
      const [userRows] = await db.execute(
        'SELECT id, name, google_uid, line_uid FROM user WHERE google_uid = ?',
        [google_uid]
      )

      const dbUser = userRows[0]
      returnUser = {
        id: dbUser.id,
        name: dbUser.name,
        google_uid: dbUser.google_uid,
        line_uid: dbUser.line_uid,
      }
    } else {
      // 2-2. 不存在 -> 建立一個新會員資料(無帳號與密碼)，只有google來的資料 -> 執行登入工作
      const [result] = await db.execute(
        `INSERT INTO user (name, email, google_uid, photo_url, level, identity, created_at) VALUES (?, ?, ?, ?, 1, 'user', NOW())`,
        [displayName, email, google_uid, photoURL]
      )

      returnUser = {
        id: result.insertId,
        name: displayName,
        google_uid: google_uid,
        line_uid: '',
      }
    }
    console.log(returnUser)
    // 產生存取令牌(access token)，其中包含會員資料
    const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
      expiresIn: '24h',
    })

    // 使用httpOnly cookie來讓瀏覽器端儲存access token
    res.cookie('accessToken', accessToken, { httpOnly: true })

    // 傳送access token回應(react可以儲存在state中使用)
    return res.json({
      status: 'success',
      data: {
        accessToken,
      },
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 'error',
      message: '伺服器錯誤，請稍後再試',
    })
  }
})
// routes/google-login.js

export default router
