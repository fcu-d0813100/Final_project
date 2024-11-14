import express from 'express'
import db from '#configs/db.js'
import multer from 'multer'
import authenticate from '#middlewares/authenticate.js'
import fs, { rename, rm } from 'fs/promises'
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
    workshop.img_cover,
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
router.get('/myWorkshop', authenticate, async function (req, res, next) {
  const id = req.user.id
  const { search = '', order } = req.query
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
    workshop.img_cover,
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

     AND teachers.id = ${id}
`

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
  GROUP_CONCAT(workshop_time.max_students ORDER BY workshop_time.date ASC) AS max_students,
  GROUP_CONCAT(workshop_time.min_students ORDER BY workshop_time.date ASC) AS min_students
  
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
  '/upload/isUpload0',
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

      ///-----------------------
      // 解析 timeSchedule 資料
      const parsedTimeSchedule = createWorkshop.timeSchedule.map((item) => {
        // 確保每個項目都是一個有效的物件
        try {
          return JSON.parse(item)
        } catch (e) {
          console.error('Error parsing timeSchedule item:', item)
          return null
        }
      })
      ///-----------------------

      // 插入每筆 timeSchedule 資料
      for (const time of parsedTimeSchedule) {
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
      // console.log('req.files' + req.files)
      // console.log('req.body' + req.body)

      res.json(result)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ message: 'Server error', error: e.message })
    }
  }
)
// 儲存，並發布
router.post(
  '/upload/isUpload1',
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
          1, // isUpload
          1, // valid
        ]
      )
      const [result] = await db.query(sqlInsertWorkshop)
      console.log('Insert Result:', result)

      // 取得新插入的 workshop_id
      const newWorkshopId = result
      console.log('New Workshop ID:', newWorkshopId)

      ///-----------------------
      // 解析 timeSchedule 資料
      const parsedTimeSchedule = createWorkshop.timeSchedule.map((item) => {
        // 確保每個項目都是一個有效的物件
        try {
          return JSON.parse(item)
        } catch (e) {
          console.error('Error parsing timeSchedule item:', item)
          return null
        }
      })
      ///-----------------------

      // 插入每筆 timeSchedule 資料
      for (const time of parsedTimeSchedule) {
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
      // console.log('req.files' + req.files)
      // console.log('req.body' + req.body)

      res.json(result)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ message: 'Server error', error: e.message })
    }
  }
)
//------------------------------------------------------------------------------------------
// 發佈課程
router.put('/myWorkshop/isUpload1', authenticate, async function (req, res) {
  const id = req.user.id
  const updateWorkshop = req.body
  try {
    const sql = SQL.format(
      'UPDATE `workshop` SET `isUpload` = ? WHERE `workshop`.`id` = ? AND `teachers_id`=?;',
      [1, updateWorkshop.id, id]
    )

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

// 取消發佈（未發布狀態）
router.put('/myWorkshop/isUpload0', authenticate, async function (req, res) {
  const id = req.user.id
  const updateWorkshop = req.body
  try {
    const sql = SQL.format(
      'UPDATE `workshop` SET `isUpload` = ? WHERE `workshop`.`id` = ? AND `teachers_id`=?;',
      [0, updateWorkshop.id, id]
    )

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

// 軟刪除（丟垃圾桶）
router.put('/myWorkshop/valid0', authenticate, async function (req, res) {
  const id = req.user.id
  const updateWorkshop = req.body
  try {
    const sql = SQL.format(
      'UPDATE `workshop` SET `valid` = ? WHERE `workshop`.`id` = ? AND `teachers_id`=?;',
      [0, updateWorkshop.id, id]
    )

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

// 復原
router.put('/myWorkshop/valid1', authenticate, async function (req, res) {
  const id = req.user.id
  const updateWorkshop = req.body
  try {
    const sql = SQL.format(
      'UPDATE `workshop` SET `valid` = ? WHERE `workshop`.`id` = ? AND `teachers_id`=?;',
      [1, updateWorkshop.id, id]
    )

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

// 真刪除（資料庫刪除）
router.delete('/myWorkshop/delete', authenticate, async function (req, res) {
  const id = req.user.id
  const deleteWorkshop = req.body
  console.log(deleteWorkshop)
  try {
    // 查詢要刪除的 workshop 的所有圖片欄位
    const [workshopData] = await db.query(
      SQL.format(
        'SELECT img_cover, img_lg, img_sm01, img_sm02 FROM workshop WHERE id = ? AND teachers_id = ?',
        [deleteWorkshop.id, id]
      )
    )

    if (workshopData.length > 0) {
      const imgFields = ['img_cover', 'img_lg', 'img_sm01', 'img_sm02']
      const folderPath = path.join(__dirname, '..', 'public', 'workshop') // 加上 .. 來退回上一層資料夾

      for (const field of imgFields) {
        const imgFile = workshopData[0][field]
        if (imgFile) {
          const imgPath = path.join(folderPath, imgFile)
          console.log('要刪除的圖片路徑:', imgPath)
          try {
            // 嘗試刪除符合的檔案
            await fs.rm(imgPath, { force: true }) // `force: true` 忽略不存在的檔案
            console.log(`圖片已刪除: ${imgFile}`)
          } catch (err) {
            console.log(`圖片不存在或無法刪除: ${imgFile}`)
          }
        }
      }
    }

    const workshopDelete = SQL.format(
      'DELETE FROM workshop WHERE `id` = ? AND `teachers_id`=?',
      [deleteWorkshop.id, id]
    )
    const timesDelete = SQL.format(
      'DELETE FROM workshop_time WHERE `workshop_id` = ?',
      [deleteWorkshop.id]
    )

    // 先刪除 workshop_time，再刪除 workshop
    await db.query(timesDelete)
    const [result] = await db.query(workshopDelete)

    //console.log(result)

    // 檢查是否有受影響的行數
    if (result.affectedRows) {
      return res.json({ status: 'success', data: null })
    } else {
      return res.json({ status: 'error', message: '刪除資料庫失敗' })
    }
  } catch (error) {
    console.error('資料庫查詢錯誤:', error.message)
    return res.status(500).json({ status: 'error', message: '伺服器錯誤' })
  }
})

//------------------------------------------------------------------------------------------
// 更新
router.put(
  '/edit/save',
  upload.fields([
    { name: 'img_cover', maxCount: 1 },
    { name: 'img_lg', maxCount: 1 },
    { name: 'img_sm01', maxCount: 1 },
    { name: 'img_sm02', maxCount: 1 },
  ]),
  authenticate,
  async function (req, res, next) {
    const id = req.user.id
    const updateWorkshop = req.body
    console.log(updateWorkshop) // 打印出來檢查

    // 檢查 `req.files` 是否存在，如果沒有則設置為空物件
    const updateFiles = req.files || {}
    const img_cover = updateFiles['img_cover']
      ? updateFiles['img_cover'][0].filename
      : updateWorkshop.img_cover // 如果沒有新圖片，使用舊圖片名稱

    const img_lg = updateFiles['img_lg']
      ? updateFiles['img_lg'][0].filename
      : updateWorkshop.img_lg // 同上

    const img_sm01 = updateFiles['img_sm01']
      ? updateFiles['img_sm01'][0].filename
      : updateWorkshop.img_sm01 // 同上

    const img_sm02 = updateFiles['img_sm02']
      ? updateFiles['img_sm02'][0].filename
      : updateWorkshop.img_sm02 // 同上

    try {
      const sqlUpdateWorkshop = SQL.format(
        'UPDATE `workshop` SET `type_id` = ?, `name` = ?, `description` = ?, `outline` = ?, `notes` = ?, `price` = ?, `address` = ?, `img_cover` = ?, `img_lg` = ?, `img_sm01` = ?, `img_sm02` = ?, `registration_start` = ?, `registration_end` = ? WHERE `workshop`.`id` = ? AND `teachers_id`=?;',
        [
          updateWorkshop.type_id,
          updateWorkshop.name,
          updateWorkshop.description,
          updateWorkshop.outline,
          updateWorkshop.notes,
          updateWorkshop.price,
          updateWorkshop.address,
          img_cover,
          img_lg,
          img_sm01,
          img_sm02,
          updateWorkshop.registration_start,
          updateWorkshop.registration_end,
          updateWorkshop.id,
          id,
        ]
      )

      const [result] = await db.query(sqlUpdateWorkshop)
      console.log('Insert Result:', result)

      // 取得新插入的 workshop_id
      // const newWorkshopId = result
      // console.log('New Workshop ID:', newWorkshopId)

      ///-----------------------
      // 解析 timeSchedule 資料
      const parsedTimeSchedule = updateWorkshop.timeSchedule.map((item) => {
        // 確保每個項目都是一個有效的物件
        try {
          return JSON.parse(item)
        } catch (e) {
          console.error('Error parsing timeSchedule item:', item)
          return null
        }
      })
      ///-----------------------

      // 插入每筆 timeSchedule 資料
      for (const time of parsedTimeSchedule) {
        const sqlUpdateWorkshopTime = SQL.format(
          'UPDATE `workshop_time` SET `date` = ?, `start_time` = ?, `end_time` = ?, `min_students` = ?, `max_students` = ? WHERE `workshop_time`.`id` = ? ',
          [
            time.date,
            time.start_time,
            time.end_time,
            time.min_students,
            time.max_students,
            time.id,
          ]
        )
        // 插入 workshop_time 資料，假設 req.body 中包含時間資料
        await db.query(sqlUpdateWorkshopTime)
      }
      console.log('req.files' + req.files)
      console.log('req.body' + req.body)

      res.json(result)
    } catch (e) {
      console.error(e)
      return res.status(500).json({ message: 'Server error', error: e.message })
    }
  }
)

// 更新，並立即發布

export default router
