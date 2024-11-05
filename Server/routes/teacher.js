import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

router.get('/', async function (req, res, next) {
  const sqlSelect = `SELECT
  teachers.id,
  teachers.name,
  teachers.gender,
  teachers.years,
  teachers.nation,
  teachers.valid,
  workshop_type.type AS workshop_type_type

 FROM
    teachers
 JOIN
    workshop_type ON workshop_type.id = teachers.type_id `

  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
  console.log(req.params)
})

router.get('/:tid', async function (req, res, next) {
  const sqlSelect = `SELECT
  teachers.*,
  workshop.id AS workshop_id,
  workshop_type.type AS workshop_type_type,
  workshop.name AS workshop_name,
  workshop.price As workshop_price,
  workshop.registration_start AS workshop_registration_start,
  workshop.registration_end AS workshop_registration_end,
  GROUP_CONCAT(workshop_time.date ORDER BY workshop_time.date ASC) AS dates


 FROM
    teachers
 JOIN
    workshop_type ON workshop_type.id = teachers.type_id
 LEFT JOIN
    workshop ON workshop.teachers_id = teachers.id   
 LEFT JOIN
    workshop_time ON workshop_time.workshop_id = workshop.id
 WHERE
    teachers.id=${req.params.tid}
  GROUP BY
    workshop.id, teachers.id, workshop.isUpload, workshop.valid, workshop_type.id `

  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
  console.log(req.params.tid)
})

router.get('/information/:tid', async function (req, res, next) {
  const sqlSelect = `SELECT
  teachers.*
 FROM
    teachers
 WHERE
    teachers.id=${req.params.tid}`

  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
  console.log(req.params.tid)
})

export default router
