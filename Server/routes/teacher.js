import express, { query } from 'express'
import db from '#configs/db.js'
import authenticate from '#middlewares/authenticate.js'
import SQL from 'sqlstring'

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
  const { search = '', type_id = '', nation = '', order = '' } = req.query
  let sqlSelect = `SELECT
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
`

  const sqlParams = [`%${search}%`, `%${search}%`, `%${search}%`]

  // 若有選擇 type_id，則加上條件
  if (type_id) {
    sqlSelect += `AND teachers.type_id = ${type_id}`
    sqlParams.push(type_id)
  }

  // 若有 nation 條件，則加入條件
  if (nation === '1') {
    sqlSelect += ` AND teachers.nation = '臺灣'`
  } else if (nation === '2') {
    sqlSelect += ` AND teachers.nation != '臺灣'`
  }

  // 加入 GROUP BY 條件
  sqlSelect += ` GROUP BY teachers.id, workshop_type.type`

  // 根據 order 值決定排序條件
  if (order === '1') {
    sqlSelect += ` ORDER BY teachers.years ASC` // 價格升冪
  } else if (order === '2') {
    sqlSelect += ` ORDER BY teachers.years DESC` // 價格降冪
  }

  const [result] = await db
    .query(sqlSelect, sqlParams)
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
  workshop.img_cover AS workshop_img_cover,
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
    teachers.id=${req.params.tid} AND workshop.isUpload=1 AND workshop.valid=1
  GROUP BY
    workshop.id, teachers.id, workshop.isUpload, workshop.valid, workshop_type.id `

  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
  console.log(req.params.tid)
})

router.put('/information/update', authenticate, async function (req, res) {
  const id = req.user.id
  const updateTeacher = req.body

  try {
    //  const sql = SQL.format(
    //    'UPDATE `teachers` SET `name` = ?, `email` = ?, `gender` = ?, `years` = ?, `birthday` = ?, `nation` = ?, `slogan` = ?, `about` = ?, `experience` = ? WHERE `teachers`.`id` = ?;',
    //    [
    //      updateTeacher.name,
    //      updateTeacher.email,
    //      updateTeacher.gender,
    //      updateTeacher.years,
    //      updateTeacher.birthday,
    //      updateTeacher.nation,
    //      updateTeacher.slogan,
    //      updateTeacher.about,
    //      updateTeacher.experience,
    //      id,
    //    ]
    //  )

    //  console.log(sql)
    //const [result] = await db.query(sql)
    // -----------------
    //  const [result] = await db.query(
    //    SQL.format(
    //      'UPDATE `teachers` SET `name` = ?, `email` = ?, `gender` = ?, `years` = ?, `birthday` = ?, `nation` = ?, `slogan` = ?, `about` = ?, `experience` = ? WHERE `teachers`.`id` = ?;',
    //      [
    //        updateTeacher.name,
    //        updateTeacher.email,
    //        updateTeacher.gender,
    //        updateTeacher.years,
    //        updateTeacher.birthday,
    //        updateTeacher.nation,
    //        updateTeacher.slogan,
    //        updateTeacher.about,
    //        updateTeacher.experience,
    //        id,
    //      ]
    //    )
    //  )
    // -----------------
    const sql = `
      UPDATE teachers 
      SET name = '${updateTeacher.name}', 
          email = '${updateTeacher.email}', 
          gender = '${updateTeacher.gender}', 
          years = '${updateTeacher.years}', 
          birthday = '${updateTeacher.birthday}', 
          nation = '${updateTeacher.nation}', 
          slogan = '${updateTeacher.slogan}', 
          about = '${updateTeacher.about}', 
          experience = '${updateTeacher.experience}' 
      WHERE id = '${id}'
    `

    const [result] = await db.query(sql)

    //console.log(result)

    // 檢查是否有受影響的行數
    if (result.affectedRows) {
      return res.json({ status: 'success', data: null })
    } else {
      return res.json({ status: 'error', message: '更新到資料庫失敗' })
    }
  } catch (error) {
    console.error('資料庫查詢錯誤:', error.message)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

export default router
