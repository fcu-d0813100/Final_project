import express from 'express'
import db from '#configs/db.js'
import multer from 'multer'
import authenticate from '#middlewares/authenticate.js'
import fs, { rename } from 'fs/promises'
import path, { resolve, extname, dirname } from 'path'
import { fileURLToPath } from 'url'
import SQL from 'sqlstring'
const router = express.Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/workshop')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'workshop-' + uniqueSuffix + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

router.use('/workshop', express.static(path.join(__dirname, 'public/workshop')))

router.get('/', async function (req, res, next) {
  const { search = '', order, min = '', max = '' } = req.query
  let sqlSelect = `SELECT
    workshop.id,
    workshop.name,
    workshop.price,
    workshop.type_id,
    teachers.id AS teacher_id,
    teachers.name AS teacher_name,
    GROUP_CONCAT(workshop_time.date ORDER BY workshop_time.date ASC) AS dates,
    workshop_time.date,
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
`

  // 若 min 和 max 存在，則加入日期範圍篩選條件
  if (min && max) {
    sqlSelect += ` AND workshop_time.date BETWEEN ? AND ?`
  }

  sqlSelect += ` GROUP BY workshop.id, teachers.id, workshop.isUpload, workshop.valid`

  // 根據 order 值決定排序條件
  if (order === '1') {
    sqlSelect += ` ORDER BY workshop.price ASC` // 價格升冪
  } else if (order === '2') {
    sqlSelect += ` ORDER BY workshop.price DESC` // 價格降冪
  } else if (order === '3') {
    sqlSelect += ` ORDER BY workshop_time.date ASC` // 日期升冪
  }

  // 設置查詢參數
  const queryParams = [`%${search}%`, `%${search}%`, `%${search}%`]
  if (min && max) {
    queryParams.push(min, max) // 添加 min 和 max 到查詢參數
  }

  const result = await db
    .query(sqlSelect, queryParams)
    .catch((e) => console.log(e))
  res.json(result)
  //console.log(result)
})

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

// 儲存，未發布
router.post(
  '/upload/page01',
  upload.fields([
    { name: 'img_cover', maxCount: 1 },
    { name: 'img_lg', maxCount: 1 },
    { name: 'img_sm01', maxCount: 1 },
    { name: 'img_sm02', maxCount: 1 },
  ]),
  authenticate,
  async function (req, res, next) {
    const id = req.user.id
    const createWorkshop = req.body
    console.log(createWorkshop) // 打印出來檢查

    // 檢查 `req.files` 是否存在，如果沒有則設置為空物件
    const uploadedFiles = req.files || {}
    const img_cover = uploadedFiles['img_cover']
      ? uploadedFiles['img_cover'][0].filename
      : null
    const img_lg = uploadedFiles['img_lg']
      ? uploadedFiles['img_lg'][0].filename
      : null
    const img_sm01 = uploadedFiles['img_sm01']
      ? uploadedFiles['img_sm01'][0].filename
      : null
    const img_sm02 = uploadedFiles['img_sm02']
      ? uploadedFiles['img_sm02'][0].filename
      : null

    try {
      const sqlInsertWorkshop = SQL.format(
        `
      INSERT INTO workshop (
        type_id, name, description, outline, notes, price, teachers_id,
        address, img_cover, img_lg,img_sm01,img_sm02,registration_start, registration_end, isUpload, valid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     `,
        [
          createWorkshop.type_id,
          createWorkshop.name,
          createWorkshop.description,
          createWorkshop.outline,
          createWorkshop.notes,
          createWorkshop.price,
          id,
          createWorkshop.address,
          img_cover,
          img_lg,
          img_sm01,
          img_sm02,
          createWorkshop.registration_start,
          createWorkshop.registration_end,
          0, // isUpload
          1, // valid
        ]
      )
      const [result] = await db.query(sqlInsertWorkshop)
      console.log('Insert Result:', result)

      // 取得新插入的 workshop_id
      const newWorkshopId = result
      console.log('New Workshop ID:', newWorkshopId)

      // 插入每筆 timeSchedule 資料
      for (const time of createWorkshop.timeSchedule) {
        const sqlInsertWorkshopTime = SQL.format(
          `
      INSERT INTO workshop_time(
      workshop_id, date, start_time, end_time, min_students, max_students, registered
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
     `,
          [
            newWorkshopId,
            time.date,
            time.start_time,
            time.end_time,
            time.min_students,
            time.max_students,
            0,
          ]
        )
        // 插入 workshop_time 資料，假設 req.body 中包含時間資料
        await db.query(sqlInsertWorkshopTime)
      }

      res.json(result)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ message: 'Server error', error: e.message })
    }
  }
)
// router.post(
//   '/upload/cover',
//   upload.single('img_cover'),
//   authenticate,
//   async function (req, res, next) {}
// )
// let ext = extname(req.file.originalname)
// let newName = `${createWorkshop.type_id}${newWorkshopId}${ext}`
// await rename(
//   req.file.path,
//   resolve(import.meta.dirname, 'public', newName)
// )
// req.body.myFile = newName
// res.json({ result, file: req.file })

export default router
