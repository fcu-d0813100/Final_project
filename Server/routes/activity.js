import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

// 路徑與上傳設置
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 設置 multer 儲存選項
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'activity-' + uniqueSuffix + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

// 靜態路徑設置
router.use('/activity', express.static(path.join(__dirname, 'public/activity')))

// 創建活動 API
// 假設路由設置在 http://localhost:3005/api/activity-Upload
// router.post('/insert-sample-data', async (req, res) => {
//   try {
//     const {
//       CHN_name,
//       ENG_name,
//       maxREG,
//       brand,
//       address,
//       start_at,
//       end_at,
//       description,
//       img1,
//       img2,
//       img3,
//     } = req.body

//     if (!CHN_name || !ENG_name) {
//       return res.status(400).json({ error: '缺少必要的欄位資料' })
//     }
//     const sqlInsertAct = `
//       INSERT INTO activity
//       (CHN_name, ENG_name, maxREG, brand, address, start_at, end_at, description, img1, img2, img3)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `

//     // 在這裡打印 SQL 語句和資料以便進行調試
//     console.log('SQL Query:', sqlInsertAct)
//     console.log('Data:', [
//       CHN_name,
//       ENG_name,
//       maxREG,
//       brand,
//       address,
//       start_at,
//       end_at,
//       description,
//       img1,
//       img2,
//       img3,
//     ])

//     const [result] = await db.query(sqlInsertAct, [
//       CHN_name,
//       ENG_name,
//       maxREG,
//       brand,
//       address,
//       start_at,
//       end_at,
//       description,
//       img1,
//       img2,
//       img3,
//     ])

//     res.json({
//       status: 'success',
//       message: `ID:${result.insertId} 假資料插入成功`,
//     })
//   } catch (error) {
//     console.error('Error inserting sample data:', error) // 打印具體的錯誤信息
//     res.status(500).json({
//       status: 'error',
//       message: '假資料插入失敗',
//     })
//   }
// })

router.post('/activity-Upload', upload.array('files'), async (req, res) => {
  try {
    const {
      CHN_name,
      ENG_name,
      maxREG,
      brand,
      address,
      start_at,
      end_at,
      description,
    } = req.body
    console.log('接收到的資料:', req.body) // 確認 req.body 是否有資料
    if (!CHN_name || !ENG_name) {
      return res.status(400).json({ error: '缺少必要的欄位資料' })
    }

    // 檢查 `req.files` 是否存在，如果沒有則設置為空陣列
    const uploadedFiles = req.files
      ? req.files.map((file) => file.filename)
      : []

    console.log('接收的文字數據:', {
      CHN_name,
      ENG_name,
      maxREG,
      brand,
      address,
      start_at,
      end_at,
      description,
    })
    console.log('接收的文件:', uploadedFiles)

    const img1 = uploadedFiles[0] || null
    const img2 = uploadedFiles[1] || null
    const img3 = uploadedFiles[2] || null

    const sqlInsertAct = `
      INSERT INTO activity 
      (CHN_name, ENG_name, maxREG, brand, address, start_at, end_at, description, img1, img2, img3)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [actResult] = await db.query(sqlInsertAct, [
      CHN_name,
      ENG_name,
      maxREG,
      brand,
      address,
      start_at,
      end_at,
      description,
      img1,
      img2,
      img3,
    ])

    const actId = actResult.insertId

    res.json({
      status: 'success',
      message: `ID:${actId} 活動、圖片插入成功`,
    })
  } catch (error) {
    console.error('Error creating event:', error)
    res.status(500).json({
      status: 'error',
      message: '活動創建失敗',
    })
  }
})

// 搜索活動數據
router.get('/search', async (req, res) => {
  const { search } = req.query // 從查詢參數中獲取 search

  try {
    // 檢查是否提供了 search 參數
    if (!search) {
      return res.status(400).json({ error: '缺少搜尋參數' })
    }

    // 使用 LIKE 語法進行模糊搜索，忽略大小寫
    const [rows] = await db.query(
      `SELECT * FROM activity 
       WHERE LOWER(brand) LIKE LOWER(?) 
       OR LOWER(ENG_name) LIKE LOWER(?) 
       OR LOWER(CHN_name) LIKE LOWER(?)`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: '活動未找到' })
    }

    res.json(rows) // 返回所有符合條件的活動
  } catch (error) {
    console.error('Failed to fetch activity details:', error)
    res.status(500).json({ error: '無法獲取活動詳細信息' })
  }
})
//搜尋狀態
router.get('/status', async (req, res) => {
  const { status } = req.query // 獲取查詢參數 status

  try {
    const currentDate = new Date()

    let query
    if (status === '0') {
      // 顯示開始時間小於當前時間的活動（報名中）
      query = 'SELECT * FROM activity WHERE start_at < ?'
    } else if (status === '1') {
      // 顯示開始時間大於當前時間的活動（已截止）
      query = 'SELECT * FROM activity WHERE start_at > ?'
    } else {
      return res.status(400).json({ error: '無效的狀態參數' })
    }

    const [rows] = await db.query(query, [currentDate])

    if (rows.length === 0) {
      return res.status(404).json({ error: '活動未找到' })
    }

    res.json(rows) // 返回所有符合條件的活動
  } catch (error) {
    console.error('Failed to fetch activity details:', error)
    res.status(500).json({ error: '無法獲取活動詳細信息' })
  }
})
router.get('/id', async (req, res) => {
  const { id } = req.query // 獲取查詢參數 id

  try {
    if (!id) {
      return res.status(400).json({ error: '缺少活動 ID' }) // 檢查是否提供了 id
    }

    // 根據 id 查詢活動信息
    const query = 'SELECT * FROM activity WHERE id = ?'
    const [rows] = await db.query(query, [id])

    if (rows.length === 0) {
      return res.status(404).json({ error: '活動未找到' })
    }

    res.json(rows[0]) // 返回第一筆符合條件的活動
  } catch (error) {
    console.error('Failed to fetch activity details:', error)
    res.status(500).json({ error: '無法獲取活動詳細信息' })
  }
})

// 獲取所有活動數據
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM activity')
    res.json(rows)
  } catch (error) {
    console.error('Failed to fetch activity:', error)
    res.status(500).json({ error: 'Failed to fetch activity' })
  }
})

// 獲取特定月份的活動數據
router.get('/month/:month', async (req, res) => {
  const { month } = req.params // 獲取路徑參數中的 month
  try {
    const [rows] = await db.query(
      'SELECT * FROM activity WHERE MONTH(start_at) = ?',
      [month]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: '活動未找到' })
    }

    res.json(rows) // 返回所有符合條件的活動
  } catch (error) {
    console.error('Failed to fetch activity details:', error)
    res.status(500).json({ error: '無法獲取活動詳細信息' })
  }
})

export default router
