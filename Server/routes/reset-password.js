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
      body {
        background-color: #f9f9f9;
        padding: 0;
        margin: 0;
        font-family: Arial, sans-serif;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        color: #333;
      }
      header {
        text-align: center;
        border-bottom: 2px solid #90957a;
        padding-bottom: 10px;
      }
      header img {
        max-width: 150px;
      }
      header p {
        font-size: 14px;
        color: #777;
      }
      .content {
        padding: 20px 30px;
        line-height: 1.6;
      }
      .content h2 {
        color: #333;
        font-size: 20px;
      }
      .content p {
        font-size: 16px;
        color: #555;
      }
      .content .tip {
        text-align: center;
        font-size: 18px;
        margin-top: 20px;
        margin-bottom: 10px;
        font-weight: bold;
        color: #555;
      }
      .content .token {
        text-align: center;
        font-size: 36px;
        font-weight: bold;
        color: #626553;
        background-color: #ededed;
        padding: 20px 40px;
        display: block;
        width: fit-content;
        border-radius: 5px;
        margin: 10px auto;
      }
      .cta-button {
        text-align: center;
        margin: 20px 0;
      }
        .minutes{
        color:#963827
        }
      .cta-button a {
        display: inline-block;
        padding: 12px 24px;
        background-color: #90957a;
        color: #ffffff;
        text-decoration: none;
        font-weight: bold;
        border-radius: 4px;
      }
      footer {
        margin-top: 30px;
        padding-top: 10px;
        border-top: 1px solid #e0e0e0;
        text-align: center;
        font-size: 12px;
        color: #888;
      }
      footer p {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <header>
        <img src="https://i.ibb.co/6ynt8GF/Beautique.png" alt="Beautique">
        <p>Where Beauty Meets Uniqueness</p>
      </header>
      <section class="content">
      <h2>親愛的會員，您好：</h2>
      <p>您已申請重設密碼，請輸入以下6位驗證碼以完成操作：</p>
      <div class="token">${otpToken}</div>
      <p>請在重設密碼頁面的《電子郵件驗證碼》欄位中輸入此驗證碼。請注意，驗證碼在寄送後<span class="minutes">30分鐘內</span>有效。</p>
      <p>為了您的帳號安全，請勿將此驗證碼透露給他人，並確認您的帳號密碼未被他人使用。</p>
      <p>如有任何疑問，請隨時聯繫 Beautique 客服人員，我們將竭誠為您服務。</p>

      </section>
      <div class="cta-button">
        <a href="http://localhost:3000">前往 Beautique</a>
      </div>
      <footer>
        <p>這是一封自動產生的郵件，請勿回覆。</p>
        <p>© 2024 Beautique. All rights reserved.</p>
      </footer>
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
    subject: `${otp.token}是您的重設密碼驗證碼`,
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

  // 加密密碼
  const hashedPassword = await generateHash(password)

  // updatePassword 中驗證 otp 的存在與合法性(是否有到期)
  const result = await updatePassword(email, token, hashedPassword)

  if (!result) {
    return res.json({ status: 'error', message: '修改密碼失敗' })
  }

  res.json({ status: 'success', message: '密碼修改成功' })
})

export default router
