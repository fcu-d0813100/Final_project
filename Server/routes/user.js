import express from 'express'
const router = express.Router()

// 資料庫使用，使用原本的mysql2 + sql
import db from '#configs/db.js'

// GET - 得到所有會員資料
router.get('/', async function (req, res) {
  const [rows] = await db.query('SELECT * FROM user')
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({ status: 'success', data: { user: rows } })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/', async function (req, res) {
  // 轉為數字(為什麼要轉為數字請見下面的說明)
  const id = req.user.id
  //id的類型必需要和模型的pk主鍵一致(註: 因為在模型裡是定義為"整數值"，自動遞增pk主鍵)
  const [rows] = await db.query('SELECT * FROM user WHERE id = ?', [id])
  return res.json({ status: 'success', data: { user: rows[0] } })
})

// 測試POST 是否能通
router.post('/', async function (req, res, next) {
  console.log(req.body)
  // 有沒有重覆的email或username
  const newUser = req.body
  const [rows] = await db.query(
    'SELECT * FROM user WHERE email = ? OR username = ?',
    [newUser.email, newUser.username]
  )

  if (rows.length > 0) {
    return res.json({ status: 'success', message: '有重覆的email或username' })
  }
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({ status: 'success', data: null })
})

router.post('/', async function (req, res, next) {
  console.log('Request body:', req.body)

  // 測試用，直接返回請求的資料
  return res.json({ status: 'success', data: req.body })
})
export default router
