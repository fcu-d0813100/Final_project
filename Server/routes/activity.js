import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

router.get('/', async function (req, res, next) {
  const sqlSelect = `SELECT
    activity.id AS activity_id,
    activity.brand,
    activity.ENG_name,
    activity.CHN_name,
    activity.address,
    activity.start_at,
    activity.end_at,
    activity.description,
    activity.currentREG,
    activity.maxREG,
    activity.brand_mail,
    activity.ours_mail,
    activity.img1 AS activity_img1,
    activity.img2 AS activity_img2,
    activity.img3 AS activity_img3
  FROM
    activity`

  try {
    const [result] = await db.query(sqlSelect)
    res.json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json({ error: '資料庫查詢失敗' })
  }
})
// router.get('/', async function (req, res, next) {
//     const sqlSelect = `SELECT
//       activity.id AS activity_id,
//       activity.brand,
//       activity.ENG_name,
//       activity.CHN_name,
//       activity.address,
//       activity.start_at,
//       activity.end_at,
//       activity.description,
//       activity.currentREG,
//       activity.maxREG,
//       activity.brand_mail,
//       activity.ours_mail,
//       activity.img1 AS activity_img1,
//       activity.img2 AS activity_img2,
//       activity.img3 AS activity_img3
//     FROM
//       activity`

//     try {
//       const [result] = await db.query(sqlSelect)
//       res.json(result)
//     } catch (e) {
//       console.log(e)
//       res.status(500).json({ error: '資料庫查詢失敗' })
//     }
//   })

export default router
