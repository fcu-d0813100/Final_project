import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

/* GET home page. */
router.get('/aa', async function (req, res, next) {
  const sqlSelect = `SELECT 
  p.id AS product_id,
  p.product_name,
  p.price,
  b.name AS brand_name,
  c.color,
  c.id AS color_id,
  c.mainimage,
  c.stock
FROM 
  product_list p
JOIN 
  brand b ON p.brand_id = b.id
JOIN 
  color c ON p.id = c.product_id`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

export default router
