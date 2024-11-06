import express from 'express'
const router = express.Router()
import db from '#configs/db.js'



//抓到優惠券資料
// router.get('/', async function (req, res, next) {
//   const sqlSelect = `SELECT *
// FROM 
//  coupon_list`
//   const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
//   res.json(result)
// })

//抓到優惠券關聯資料
router.get('/relation', async function (req, res, next) {
  const sqlSelect = `SELECT *
FROM 
 coupon_relatoin`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

export default router
