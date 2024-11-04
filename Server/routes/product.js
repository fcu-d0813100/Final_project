import express from 'express'
import db from '#configs/db.js'
import cors from 'cors'

const router = express.Router()
router.use(cors())

router.get('/product-list', async function (req, res, next) {
  const sqlSelect = `
    SELECT 
      p.id AS id,
      p.product_name,
      p.price,
      b.name AS brand,
      c.id AS color_id,
      c.color_name,
      c.mainimage,
      c.stock
    FROM 
      product_list p
    JOIN 
      brand b ON p.brand_id = b.id
    JOIN 
      color c ON p.id = c.product_id
  `
  try {
    const [result] = await db.query(sqlSelect)
    res.json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: '資料查詢錯誤' })
  }
})

export default router
