import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

// router.get('/', async function (req, res, next) {
//   let workshop = await db //await下一行馬上使用
//     .execute('SELECT * FROM `workshop`') //execute 回傳的值是陣列[result,fields]
//     .then(([results, fields]) => {
//       //再包裝
//       return results
//     })
//     .catch((error) => {
//       console.log(error)
//       return undefined
//     })
//   res.render({ workshop })
// })

router.get('/', async function (req, res, next) {
  const sqlSelect = `SELECT
    workshop.id,
    workshop.name,
    workshop.price,
    workshop.type_id,
    teachers.id AS teacher_id,
    teachers.name AS teacher_name,
    GROUP_CONCAT(workshop_time.date ORDER BY workshop_time.date ASC) AS dates,
    workshop.registration_start,
    workshop.registration_end,
    workshop.isUpload,
    workshop.valid
 FROM
    workshop
 JOIN
    teachers ON  workshop.teachers_id = teachers.id 
LEFT JOIN
      workshop_time ON workshop_time.workshop_id = workshop.id
    GROUP BY
      workshop.id, teachers.id, workshop.isUpload, workshop.valid`

  const result = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
  console.log(result)
})

export default router
