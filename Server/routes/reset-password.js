import express from 'express'
const router = express.Router()
import { createOtp, updatePassword } from '#db-helpers/otp.js'
import { generateHash } from '##/db-helpers/password-hash.js'

import transporter from '#configs/mail.js'
import 'dotenv/config.js'
const mailHtml = (otpToken) => `
<html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:ital,wght@0,400..700;1,400..700&display=swap');

      body {
        font-family: 'Libre Bodoni', serif;
        font-weight: 400;
        font-style: normal;
        font-size: 16px;
        line-height: 1.5;
      }
      .padding-setting {
        padding-inline: 10px;
      }
      .title {
        font-weight: 700;
        font-size: 20px;
      }
      .content {
        padding: 5px;
        margin-block: 10px;
        border: 1px solid gray;
      }
      .token-content {
        display: flex;
        justify-content: center;
        background-color: #4b4d3f;
        color: white;
        padding-block: 20px;
        width: 400px;
        height: 100px;

      }
      .tip {
        text-align: center;
        font-size: 20px;
        font-weight: 800;
      }
      .token {
        text-align: center;
        font-size: 40px;
        font-weight: 800;
      }
      .column {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-inline: 10px;
      }
      .center {
        display: flex;
        justify-content: center;
      }
      .logo {
        font-style: italic;
        color: #90957A;
        font-weight: 500;
        font-size: 50px;
      }
    </style>
  </head>
  <body>
    <div class="padding-setting">
      <p class="title">親愛的 Beautique 會員您好：</p>

      <div class="content">
        通知重設密碼所需要的驗證碼，<br />
        將以下6位驗證碼輸入於：<br />
        重設密碼頁面的《電子郵件驗證碼》欄位中。<br />
        <br />
        請注意驗證碼將於寄送後 30 分鐘後過期，<br />
        如有任何問題請洽 Beautique 客服人員，謝謝。
      </div>

      <div class="token-content">
        <div class="column">
          <div class="tip">請輸入以下的6位數字：</div>
          <div class="token">${otpToken}</div>
        </div>
      </div>
      <p>Beautique 敬上</p>
      <p class="logo">Beautique</p>
    </div>
  </body>
</html>
`

// 使用時，將此HTML傳遞給您的電子郵件發送功能

router.post('/otp', async (req, res, next) => {
  const { email } = req.body
  if (!email) return res.json({ status: 'error', message: '缺少必要資料' })

  // 建立otp資料表記錄，成功回傳otp記錄物件，失敗為空物件{}
  const otp = await createOtp(email)
  if (!otp.token)
    return res.json({ status: 'error', message: 'Email錯誤或期間內重覆要求' })

  // 寄送email
  const mailOptions = {
    from: `"Beautique官方"<${process.env.SMTP_TO_EMAIL}>`,
    to: email,
    subject: '重設密碼要求的電子郵件驗證碼',
    html: mailHtml(otp.token),
  }

  transporter.sendMail(mailOptions, (err, response) => {
    if (err) {
      // 失敗處理
      // console.log(err)
      return res.json({ status: 'error', message: '發送電子郵件失敗' })
    } else {
      // 成功回覆的json
      return res.json({ status: 'success', data: null })
    }
  })
})

// 重設密碼用
router.post('/reset', async (req, res) => {
  const { email, token, password } = req.body

  if (!token || !email || !password) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // updatePassword中驗証otp的存在與合法性(是否有到期)
  const result = await updatePassword(email, token, password)

  if (!result) {
    return res.json({ status: 'error', message: '修改密碼失敗' })
  }

  // 成功
  return res.json({ status: 'success', data: null })
})

export default router
