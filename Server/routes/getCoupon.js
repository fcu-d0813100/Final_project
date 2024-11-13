import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

// 抓取會員的優惠券資料
router.get('/', async function (req, res) {
  const userId = req.query.userId

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' })
  }

  try {
    // 定義查詢語句的不同部分，直接插入 userId 變數
    const selectFields = `
    cl.id AS coupon_list_id,
    cr.id AS coupon_relation_id,
    cl.type_id,
    cl.brand_id,
    cl.code,
    cl.name,
    cl.discount_value,
    cl.minimum_amount,
    cl.start_date,
    cl.end_date,
    cl.used,
    cl.maximum,
    cl.valid,
    b.name AS brand_name
  `

    const fromClause = `
    FROM 
      coupon_list AS cl
    JOIN 
      coupon_relation AS cr ON cl.id = cr.coupon_id
    JOIN 
      brand AS b ON cl.brand_id = b.id
  `

    const whereClause = `
    WHERE cr.user_id = ${userId} 
    AND cr.order_id IS NULL
    AND cl.end_date >= CURDATE() 
    AND cl.start_date <= CURDATE() 
    AND cl.used < cl.maximum
    AND cl.valid = 1
  `

    const groupByClause = `
    GROUP BY cl.id
  `

    // 組合成完整的 SQL 查詢
    const sqlSelect = `SELECT ${selectFields} ${fromClause} ${whereClause} ${groupByClause}`

    const [result] = await db.query(sqlSelect) // 不需要額外傳入參數
    res.json({ data: result })
  } catch (error) {
    console.error('Database query error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
