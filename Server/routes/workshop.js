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
  const { search = '' } = req.query
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
    workshop.valid,
    workshop_type.type AS workshop_type_type
 FROM
    workshop
 JOIN
    teachers ON  workshop.teachers_id = teachers.id 
 LEFT JOIN
      workshop_time ON workshop_time.workshop_id = workshop.id
 LEFT JOIN
    workshop_type ON workshop.type_id = workshop_type.id
 WHERE
     (workshop.name LIKE '%${search}%' OR teachers.name LIKE '%${search}%' OR workshop_type.type LIKE '%${search}%')
     AND workshop.valid = 1 
     AND workshop.isUpload = 1
 GROUP BY
      workshop.id, teachers.id, workshop.isUpload, workshop.valid
`

  const result = await db
    .query(sqlSelect, [`%${search}%`, `%${search}%`, `%${search}%`])
    .catch((e) => console.log(e))
  res.json(result)
  //console.log(result)
})

// router.get('/search', async function (req, res, next) {
//   const { search = '' } = req.query
//   const sqlSelect = `
//     SELECT
//     workshop.name,
//     teachers.name AS teachers_name,
//     workshop_type.type AS workshop_type_type

//     FROM
//       workshop
//     JOIN
//       teachers ON  workshop.teachers_id = teachers.id
//     LEFT JOIN
//       workshop_type ON workshop.type_id = workshop_type.id

//     WHERE
//       workshop.name LIKE '%${search}%' OR teachers.name LIKE '%${search}%' OR workshop_type.type LIKE '%${search}%' AND workshop.valid = 1
//   `
//   const result = await db
//     .query(sqlSelect, [`%${search}%`, `%${search}%`, `%${search}%`])
//     .catch((e) => console.log(e))
//   res.json(result)
//   console.log(result)
// })

router.get('/:wid', async function (req, res, next) {
  //   const { wid } = req.params
  const sqlSelect = `SELECT
  workshop.*,
  teachers.id AS teacher_id,
  teachers.name AS teacher_name,
  workshop_type.id AS workshop_type_id,
  workshop_type.type AS workshop_type_type,
  workshop_time.id AS workshop_time_id,

  GROUP_CONCAT(workshop_time.date ORDER BY workshop_time.date ASC) AS dates,
  GROUP_CONCAT(workshop_time.start_time ORDER BY workshop_time.date ASC) AS start_times,
  GROUP_CONCAT(workshop_time.end_time ORDER BY workshop_time.date ASC) AS end_times,
  GROUP_CONCAT(workshop_time.id ORDER BY workshop_time.date ASC) AS time_id,
  GROUP_CONCAT(workshop_time.registered ORDER BY workshop_time.date ASC) AS workshop_time_registered,
  GROUP_CONCAT(workshop_time.max_students ORDER BY workshop_time.date ASC) AS max_students
  
 FROM
    workshop
 JOIN
    teachers ON  workshop.teachers_id = teachers.id 
 LEFT JOIN
    workshop_time ON workshop_time.workshop_id = workshop.id
 LEFT JOIN
    workshop_type ON workshop.type_id = workshop_type.id
WHERE
    workshop.id=${req.params.wid}
 GROUP BY
    workshop.id, teachers.id, workshop.isUpload, workshop.valid, workshop_type.id`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
  console.log(req.params.wid)
})

export default router
