import express from 'express'
import db2 from '../configs/mysql.js'
const router = express.Router()

/* GET home page. */
router.get('/aa', async function (req, res, next) {
  try {
    const [rows] = await db2.query('SELECT * FROM `product_list`') // 確認資料表名稱是否正確
    res.json(rows)
  } catch (err) {
    console.error('查詢錯誤：', err)
    res.status(500).send(err)
  }
})

export default router
