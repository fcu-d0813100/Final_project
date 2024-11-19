import express from 'express'
const router = express.Router()

import jsonwebtoken from 'jsonwebtoken'

// import sequelize from '#configs/db.js';
// const { User } = sequelize.models;
import db from '##/configs/mysql.js'

// line-login模組
import line_login from '#services/line-login.js'

// 存取`.env`設定檔案使用
import 'dotenv/config.js'

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
// line 登入使用
const channel_id = process.env.LINE_CHANNEL_ID
const channel_secret = process.env.LINE_CHANNEL_SECRET
const callback_url = process.env.LINE_LOGIN_CALLBACK_URL

const LineLogin = new line_login({
  channel_id,
  channel_secret,
  // react line page callback url
  // 注意: LINE_LOGIN_CALLBACK_URL 是前端(react/next)路由
  // 必需要與 LINE Developer 的 "Callback URL" 設定一致
  // 目前與LINE登入頁設定為一致(登入頁路由=回調頁路由)
  callback_url,
  scope: 'openid profile',
  prompt: 'consent',
  bot_prompt: 'normal',
})

// ------------ 以下為路由 ------------
// 此api路由為產生登入網址，傳回前端後，要自己導向line網站進行登入
router.get('/login', LineLogin.authJson())

// 登出機制
router.get('/logout', async function (req, res, next) {
  try {
    // 檢查是否傳遞了 line_uid
    const line_uid = req.query.line_uid
    console.log('接收到的 line_uid:', line_uid) // 日誌輸出 line_uid
    if (!line_uid) {
      console.error('缺少 line_uid')
      return res.json({ status: 'error', message: '缺少必要資料' })
    }

    // 查詢資料
    const [dbUser] = await db.query('SELECT * FROM user WHERE line_uid = ?', [
      line_uid,
    ])
    console.log('查詢到的使用者:', dbUser) // 日誌輸出查詢結果

    if (!dbUser || dbUser.length === 0) {
      console.error(`找不到對應的使用者，line_uid: ${line_uid}`)
      return res.json({ status: 'error', message: '使用者不存在' })
    }

    const user = dbUser[0] // 獲取查詢結果的第一個用戶對象
    console.log('User Found for Logout:', user) // 這行是用於調試，確保正確獲取數據

    const line_access_token = user.line_access_token

    if (!line_access_token) {
      console.error('line_access_token 不存在')
      return res.json({
        status: 'error',
        message: '無法獲取 line_access_token',
      })
    }

    // https://developers.line.biz/en/docs/line-login/managing-users/#logout
    // 登出時進行撤銷(revoke) access token
    await LineLogin.revoke_access_token(line_access_token)

    // 清除cookie
    res.clearCookie('accessToken', { httpOnly: true })
    // 因登入過程中也用到session，也會產生 SESSION_ID，所以也要清除
    res.clearCookie('SESSION_ID', { httpOnly: true })
    console.log('登出成功')
    return res.json({ status: 'success', data: null })
  } catch (error) {
    console.error('登出過程中出現錯誤:', error)
    return res.json({ status: 'error', message: '登出過程中出現錯誤' })
  }
})

// 此api路由為line登入後，從前端(react/next)callback的對應路由頁面，即真正登入處理路由
router.get(
  '/callback',
  LineLogin.callback(
    // 登入成功的回調函式 Success callback
    async (req, res, next, token_response) => {
      {
        const code = req.query.code
        const state = req.query.state
        console.log(`收到code: ${code}, state: ${state}`)
      }
      try {
        console.log('Token Response:', token_response)

        // 以下流程:
        // 1. 先查詢資料庫是否有同line_uid的資料
        // 2-1. 有存在 -> 執行登入工作
        // 2-2. 不存在 -> 建立一個新會員資料(無帳號與密碼)，只有line來的資料 -> 執行登入工作

        const line_uid = token_response.id_token.sub

        // 1. 先查詢資料庫是否有同line_uid的資料
        const [existingUser] = await db.query(
          'SELECT COUNT(*) as total FROM user WHERE line_uid = ?',
          [line_uid]
        )
        const total = existingUser[0].total
        console.log('Total Users Found:', total)

        // 要加到access token中回傳給前端的資料
        let returnUser = {
          id: 0,
          account: '',
          google_uid: '',
          line_uid: '',
        }

        if (total) {
          // 2-1. 有存在 -> 從資料庫查詢會員資料
          const [dbUser] = await db.query(
            'SELECT id, account, google_uid, line_uid FROM user WHERE line_uid = ?',
            [line_uid]
          )

          const user = dbUser[0]
          console.log('Existing User Found:', user)

          // 回傳給前端的資料
          returnUser = {
            id: user.id,
            account: user.account,
            google_uid: user.google_uid,
            line_uid: user.line_uid,
          }
        } else {
          // 2-2. 不存在 -> 建立一個新會員資料(無帳號與密碼)，只有line來的資料 -> 執行登入工作
          const user = {
            name: token_response.id_token.name,
            email: '',
            line_uid: token_response.id_token.sub,
            line_access_token: token_response.access_token,
            photo_url: token_response.id_token.picture,
          }

          // 新增會員資料
          const [insertResult] = await db.query(
            'INSERT INTO user (name, email, line_uid, line_access_token, photo_url,level, created_at,identity) VALUES (?, ?, ?, ?, ?,1,NOW(),"user")',
            [
              user.name,
              user.email,
              user.line_uid,
              user.line_access_token,
              user.photo_url,
            ]
          )
          console.log('Insert Result:', insertResult)

          if (insertResult.affectedRows === 0) {
            console.log('新增會員資料失敗')
            return res.json({ status: 'error', message: '新增會員資料失敗' })
          }

          // 查詢新會員資料並回傳給前端
          const [dbUser] = await db.query(
            'SELECT id, account, google_uid, line_uid FROM user WHERE line_uid = ?',
            [user.line_uid]
          )

          if (dbUser.length === 0) {
            console.log('查詢新增會員資料失敗')
            return res.json({
              status: 'error',
              message: '查詢新增會員資料失敗',
            })
          }

          const newUser = dbUser[0]
          console.log('New User Created:', newUser)

          returnUser = {
            id: newUser.id,
            account: '',
            google_uid: newUser.google_uid,
            line_uid: newUser.line_uid,
          }
        }

        // 產生存取令牌(access token)，其中包含會員資料
        const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
          expiresIn: '24h',
        })

        // 使用httpOnly cookie來讓瀏覽器端儲存access token
        res.cookie('accessToken', accessToken, { httpOnly: true })

        // 傳送access token回應(react可以儲存在state中使用)
        console.log('Access Token Generated:', accessToken)
        return res.json({
          status: 'success',
          data: {
            accessToken,
          },
        })
      } catch (error) {
        console.error('登入過程中出現錯誤:', error)
        return res.json({ status: 'error', message: '登入過程中出現錯誤' })
      }
    },
    // 登入失敗的回調函式 Failure callback
    (req, res, next, error) => {
      console.log('line login fail', error)
      return res.json({ status: 'error', message: { error } })
    }
  )
)

export default router
