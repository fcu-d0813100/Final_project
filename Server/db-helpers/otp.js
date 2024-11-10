import { generateToken } from '#configs/otp.js'
import db from '##/configs/mysql.js'

const shouldReset = (expTimestamp, exp, limit = 60) => {
  const createdTimestamp = expTimestamp - exp * 60 * 1000
  return Date.now() - createdTimestamp > limit * 1000
}

const createOtp = async (email, exp = 30, limit = 60) => {
  // 檢查使用者email是否存在
  const [userRows] = await db.query('SELECT id FROM user WHERE email= ?', [
    email,
  ])

  if (userRows.length === 0) {
    console.log('ERROR - 使用者帳號不存在'.bgRed)
    return {}
  }

  const user = userRows[0]

  // 檢查otp是否已經存在
  const [otpRows] = await db.query('SELECT * FROM otp WHERE email= ?', [email])

  if (
    otpRows.length > 0 &&
    !shouldReset(otpRows[0].exp_timestamp, exp, limit)
  ) {
    console.log('ERROR - 60s(秒)內要求重新產生otp'.bgRed)
    return {}
  }

  // 產生新的otp token
  const token = generateToken(email)
  const exp_timestamp = Date.now() + exp * 60 * 1000

  if (otpRows.length > 0 && shouldReset(otpRows[0].exp_timestamp, exp, limit)) {
    // 修改Otp
    await db.query('UPDATE otp SET token=?, exp_timestamp=? WHERE email=?;', [
      token,
      exp_timestamp,
      email,
    ])

    return {
      ...otpRows[0],
      exp_timestamp,
      token,
    }
  }

  // 建立新的otp記錄
  await db.query(
    'INSERT INTO otp (user_id, email, token, exp_timestamp) VALUES (?, ?, ?, ?);',
    [user.id, email, token, exp_timestamp]
  )

  return {
    user_id: user.id,
    email,
    token,
    exp_timestamp,
  }
}

const updatePassword = async (email, token, password) => {
  // 檢查otp是否已經存在
  const [otpRows] = await db.query(
    'SELECT * FROM otp WHERE email=? AND token=?;',
    [email, token]
  )

  if (otpRows.length === 0) {
    console.log('ERROR - OTP Token資料不存在'.bgRed)
    return false
  }

  const foundOtp = otpRows[0]

  if (Date.now() > foundOtp.exp_timestamp) {
    console.log('ERROR - OTP Token已到期'.bgRed)
    return false
  }

  // 修改密碼
  await db.query('UPDATE user SET password=? WHERE id=?;', [
    password,
    foundOtp.user_id,
  ])

  // 移除otp記錄
  await db.query('DELETE FROM otp WHERE id=?;', [foundOtp.id])

  return true
}

export { createOtp, updatePassword }
