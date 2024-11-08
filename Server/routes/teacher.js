import express from 'express'
import db from '#configs/db.js'
import authenticate from '#middlewares/authenticate.js'

const router = express.Router()

router.get('/information', authenticate, async function (req, res) {
  const id = req.user.id

  const sqlSelect = `SELECT
   teachers.*,
      user.account AS user_account

   FROM
   teachers
   JOIN
    workshop_type ON workshop_type.id = teachers.type_id 
 LEFT JOIN
    user ON user.id = teachers.id
   WHERE
   teachers.id = ${id}
`

  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result[0])
  console.log(req.params)
})

router.get('/', async function (req, res) {
  const { search = '' } = req.query
  const sqlSelect = `SELECT
  teachers.*,
  user.account AS user_account,
  workshop_type.type AS workshop_type_type

 FROM
    teachers
 JOIN
    workshop_type ON workshop_type.id = teachers.type_id 
 LEFT JOIN
    user ON user.id = teachers.id
 WHERE
    (teachers.name LIKE '%${search}%' OR teachers.nation LIKE '%${search}%' OR workshop_type.type LIKE '%${search}%')
    AND teachers.valid = 1  
  GROUP BY
     teachers.id, workshop_type.type`

  const [result] = await db
    .query(sqlSelect, [(`%${search}%`, `%${search}%`, `%${search}%`)])
    .catch((e) => console.log(e))
  res.json(result)
  console.log(req.params)
})

router.get('/:tid', async function (req, res) {
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

// router.put('/information/Update', async function (req, res) {
//   const {
//     name,
//     email,
//     nation,
//     gender,
//     years,
//     birthday,
//     slogan,
//     about,
//     experience,
//     id,
//   } = req.body
//   //值沒帶進去

//   const sqlUpdate =
//     'UPDATE `teachers` SET `name`=?, `email`=?, `nation`=?, `gender`=?, `years`=?, `slogan`=?, `about`=?, `experience`=?, `birthday`=? WHERE `id`=?;'

//   const [result] = await db.query(sqlUpdate, [
//     name,
//     email,
//     nation,
//     gender,
//     years,
//     slogan,
//     about,
//     experience,
//     birthday,
//     id,
//   ])

//   // 傳回結果
//   res.json(result)
//   //console.log(req.params)
// })

export default router
