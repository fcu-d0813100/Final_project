import express from 'express'
import db from '#configs/db.js'
import multer from 'multer'
import authenticate from '#middlewares/authenticate.js'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
const upload = multer()
const router = express.Router()
import SQL from 'sqlstring'

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
router.post('/upload/page01', authenticate, async function (req, res, next) {
  const id = req.user.id
  const createWorkshop = req.body
  console.log(createWorkshop) // 打印出來檢查

  try {
    const sqlInsertWorkshop = SQL.format(
      `
      INSERT INTO workshop (
        type_id, name, description, outline, notes, price, teachers_id,
        address, registration_start, registration_end, isUpload, valid
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
})

//儲存未發布
// router.post(
//   '/upload/page01',
//   authenticate,
//   upload.single('img_cover'),
//   async function (req, res, next) {
//     const id = req.user.id
//     const createWorkshop = req.body
//     const uploadedFile = req.file

//     console.log(req.file, req.body)

//     const sqlInsertWorkshop = `
//     INSERT INTO workshop (
//         type_id, name, description, outline, notes, price, teachers_id,
//         address, registration_start, registration_end, isUpload, valid
//     ) VALUES (
//         '${createWorkshop.type_id}', '${createWorkshop.name}', '${createWorkshop.description}',
//         '${createWorkshop.outline}', '${createWorkshop.notes}', '${createWorkshop.price}',
//         '${id}', '${createWorkshop.address}', '${createWorkshop.registration_start}',
//         '${createWorkshop.registration_end}', 0, 1
//     )`

//     const sqlInsertWorkshopTime = `
//     INSERT INTO workshop_time(
//       workshop_id, date, start_time, end_time, min_students, max_students
//     ) VALUES(
//       '${createWorkshop.workshop_id}', '${createWorkshop.date}', '${createWorkshop.start_time}',
//       '${createWorkshop.end_time}', '${createWorkshop.min_students}', '${createWorkshop.max_students}'
//     )
// `

//     try {
//       // 插入 workshop 資料
//       const [result] = await db.query(sqlInsertWorkshop)

//       // 取得新插入的 workshop_id
//       const newWorkshopId = result.insertId

//       // 插入 workshop_time 資料，假設 req.body 中包含時間資料
//       await db.query(sqlInsertWorkshopTime)

//       if (uploadedFile) {
//         // 使用 import.meta.url 獲取當前模組的目錄
//         const __dirname = dirname(fileURLToPath(import.meta.url))
//         // 設定圖片儲存路徑為 /public/workshop
//         const destinationDir = join(__dirname, '..', 'public', 'workshop')
//         const newFileName = `${createWorkshop.typeId}-${newWorkshopId}-c.jpg`
//         const newFilePath = join(destinationDir, newFileName)

//         // 確保目錄存在，否則創建目錄
//         await fs.promises.mkdir(destinationDir, { recursive: true })

//         // 使用 async/await 的方式重命名圖片
//         try {
//           await fs.promises.rename(uploadedFile.path, newFilePath)
//           console.log('圖片已成功重命名:', newFileName)

//           // 回傳成功訊息
//           return res.json({
//             body: req.body,
//             file: newFileName,
//             message: 'success',
//             code: '200',
//           })
//         } catch (renameErr) {
//           console.error('圖片重命名失敗:', renameErr)
//           res.status(500).json({ message: '圖片重命名失敗', code: '500' })
//         }
//       } else {
//         console.log('沒有上傳檔案')
//         return res.json({ message: 'fail', code: '409' })
//       }
//     } catch (e) {
//       console.error(e)
//       return res.status(500).json({ message: 'Server error', error: e.message })
//     }
//   }
// )

// router.post(
//   '/upload/page01',
//   authenticate,

//   async function (req, res, next) {
//     const id = req.user.id
//     const createWorkshop = req.body

//     // // 確保資料的有效性，檢查必要欄位是否存在
//     // if (
//     //   !createWorkshop.type_id ||
//     //   !createWorkshop.name ||
//     //   !createWorkshop.description
//     // ) {
//     //   return res.status(400).json({ message: 'Missing required fields' })
//     // }

//     const sql = SQL.format(`
//       INSERT INTO workshop (
//         type_id, name, description, outline, notes, price, teachers_id,
//         address, registration_start, registration_end, isUpload, valid, img_cover, img_lg, img_sm01, img_sm02
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `)
//     const sqlInsertWorkshop = sql

//     try {
//       // 使用參數化查詢來執行 SQL 插入
//       const [result] = await db.query(sqlInsertWorkshop, [
//         createWorkshop.type_id,
//         createWorkshop.name,
//         createWorkshop.description,
//         createWorkshop.outline,
//         createWorkshop.notes,
//         createWorkshop.price,
//         id, // teachers_id
//         createWorkshop.address,
//         createWorkshop.registration_start,
//         createWorkshop.registration_end,
//         0, // isUpload
//         1, // valid
//         '', // img_cover
//         '', // img_lg
//         '', // img_sm01
//         '', // img_sm02
//       ])

//       // 取得新插入的 workshop_id
//       const newWorkshopId = result.insertId

//       // 插入 workshop_time 資料
//       const sqlInsertWorkshopTime = SQL.format(`
//         INSERT INTO workshop_time (
//           workshop_id, date, start_time, end_time, min_students, max_students
//         ) VALUES (?, ?, ?, ?, ?, ?)
//       `)

//       await db.query(sqlInsertWorkshopTime, [
//         newWorkshopId,
//         createWorkshop.date,
//         createWorkshop.start_time,
//         createWorkshop.end_time,
//         createWorkshop.min_students,
//         createWorkshop.max_students,
//       ])

//       // 回應成功
//       return res.json({
//         message: 'created successfully',
//         workshop_id: newWorkshopId,
//       })
//     } catch (e) {
//       console.error(e)
//       return res.status(500).json({ message: 'Server error', error: e.message })
//     }
//   }
// )

router.post('/upload/page01/time', async function (req, res, next) {})

export default router
