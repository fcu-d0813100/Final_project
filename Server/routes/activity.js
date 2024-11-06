import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()

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

// 獲取所有文章數據
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
router.get('/:month', async (req, res) => {
  const { month } = req.params // 獲取路徑參數中的 month
  try {
    // 使用 MONTH() 函數篩選出指定月份的活動
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
