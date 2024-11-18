import express from 'express'
import db from '#configs/mysql.js'
const router = express.Router()
import nodemailer from 'nodemailer'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

//--------------------------------------管理員上架與編輯-----------------------------------------------
//--------------------------------------管理員上架與編輯-----------------------------------------------
//--------------------------------------管理員上架與編輯-----------------------------------------------

// 路徑與上傳設置
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 設置 multer 儲存選項
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/activity')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'activity-' + uniqueSuffix + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

// 靜態路徑設置
router.use('/activity', express.static(path.join(__dirname, 'public/activity')))

router.post('/activity-Upload', upload.array('files'), async (req, res) => {
  try {
    const {
      CHN_name,
      ENG_name,
      maxREG,
      brand, // 接收 brand，而不是直接傳 brand_mail
      address,
      start_at,
      end_at,
      description,
    } = req.body
    console.log('接收到的資料:', req.body) // 確認 req.body 是否有資料
    if (!CHN_name || !ENG_name || !brand) {
      return res.status(400).json({ error: '缺少必要的欄位資料' })
    }

    // 根據 brand 值設定 brand_mail
    let brand_mail
    if (brand === 'YSL') {
      brand_mail = 'https://www.yslbeauty.com.tw'
    } else if (brand === 'NARS') {
      brand_mail = 'https://www.narscosmetics.com'
    } else if (brand === 'Bobbi Brown') {
      brand_mail = 'https://www.bobbibrown.com.tw'
    } else if (brand === 'Estee Lauder') {
      brand_mail = 'https://www.esteelauder.com.tw'
    } else {
      brand_mail = 'https://www.lancome.com.tw/' // 如果沒有匹配，設置一個默認值
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
      brand_mail, // 顯示動態設置的 brand_mail
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
      (CHN_name, ENG_name, maxREG, brand_mail, brand, address, start_at, end_at, description, img1, img2, img3)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [actResult] = await db.query(sqlInsertAct, [
      CHN_name,
      ENG_name,
      maxREG,
      brand_mail, // 插入設置好的 brand_mail
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
router.put('/activity-edit/:id', upload.array('files'), async (req, res) => {
  try {
    const { id } = req.params // 獲取活動 ID
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

    // 確認接收到的數據是否包含必要的欄位
    if (!CHN_name || !ENG_name || !brand) {
      return res.status(400).json({ error: '缺少必要的欄位資料' })
    }

    // 根據 brand 值動態設定 brand_mail
    let brand_mail
    switch (brand) {
      case 'YSL':
        brand_mail = 'https://www.yslbeauty.com.tw'
        break
      case 'NARS':
        brand_mail = 'https://www.narscosmetics.com'
        break
      case 'Bobbi Brown':
        brand_mail = 'https://www.bobbibrown.com.tw'
        break
      case 'Estee Lauder':
        brand_mail = 'https://www.esteelauder.com.tw'
        break
      default:
        brand_mail = 'https://www.lancome.com.tw/'
        break
    }

    // 檢查 `req.files` 是否存在
    const uploadedFiles = req.files
      ? req.files.map((file) => file.filename)
      : []
    const img1 = uploadedFiles[0] || null
    const img2 = uploadedFiles[1] || null
    const img3 = uploadedFiles[2] || null

    // 構建 SQL 查詢以更新活動資料
    const sqlUpdateAct = `
      UPDATE activity SET
      CHN_name = ?, ENG_name = ?, maxREG = ?, brand_mail = ?, brand = ?,
      address = ?, start_at = ?, end_at = ?, description = ?,
      img1 = COALESCE(?, img1), img2 = COALESCE(?, img2), img3 = COALESCE(?, img3)
      WHERE id = ?
    `

    // 執行更新操作
    const [updateResult] = await db.query(sqlUpdateAct, [
      CHN_name,
      ENG_name,
      maxREG,
      brand_mail,
      brand,
      address,
      start_at,
      end_at,
      description,
      img1,
      img2,
      img3,
      id,
    ])

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: '找不到對應的活動資料' })
    }

    res.json({
      status: 'success',
      message: `ID:${id} 活動資料更新成功`,
    })
  } catch (error) {
    console.error('Error updating event:', error)
    res.status(500).json({
      status: 'error',
      message: '活動更新失敗',
    })
  }
})
router.put('/delete/:id', async function (req, res, next) {
  const sqlUpdate = `UPDATE activity SET valid = 0 WHERE id = ?`
  const { id } = req.params // 從請求路徑參數中提取 id

  try {
    await db.query(sqlUpdate, [id]) // 將 id 傳遞給 SQL 查詢
    res.json({ status: 'success', message: '刪除活動成功' })
  } catch (error) {
    console.error('Error deleting activity:', error)
    res.status(500).json({ status: 'error', message: '刪除活動失敗' })
  }
})

//--------------------------------------活動列表及活動細節-----------------------------------------------
//--------------------------------------活動列表及活動細節-----------------------------------------------
//--------------------------------------活動列表及活動細節-----------------------------------------------

// 搜索活動數據
router.get('/search/:userId', async (req, res) => {
  const { search } = req.query // 從查詢參數中獲取 search
  const { userId } = req.params // 從路徑參數中獲取 userId

  try {
    // 檢查是否提供了 search 參數
    if (!search) {
      return res.status(400).json({ error: '缺少搜尋參數' })
    }

    // 使用 LIKE 語法進行模糊搜索，並連接 activity_fav 表，根據 userId 判斷是否收藏
    const [rows] = await db.query(
      `SELECT 
        activity.*, 
        IF(activity_fav.user_id IS NOT NULL, 1, 0) AS is_favorite
      FROM 
        activity
      LEFT JOIN 
        activity_fav ON activity.id = activity_fav.act_id AND activity_fav.user_id = ?
      WHERE 
        (LOWER(activity.brand) LIKE LOWER(?) 
         OR LOWER(activity.ENG_name) LIKE LOWER(?) 
         OR LOWER(activity.CHN_name) LIKE LOWER(?))
        AND activity.valid = 1
        ORDER BY activity.id ASC`,
      [userId, `%${search}%`, `%${search}%`, `%${search}%`]
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
router.get('/status/:userId', async (req, res) => {
  const { status } = req.query // 獲取查詢參數 status
  const { userId } = req.params

  try {
    const currentDate = new Date()

    let query
    if (status === '0') {
      // 顯示開始時間小於當前時間的活動（報名中）
      query = `
        SELECT 
          activity.*, 
          IF(activity_fav.user_id IS NOT NULL, 1, 0) AS is_favorite
        FROM 
          activity
        LEFT JOIN 
          activity_fav ON activity.id = activity_fav.act_id AND activity_fav.user_id = ?
        WHERE 
          activity.start_at < ? 
          AND activity.valid = 1
        ORDER BY activity.id ASC
      `
    } else if (status === '1') {
      // 顯示開始時間大於當前時間的活動（已截止）
      query = `
        SELECT 
          activity.*, 
          IF(activity_fav.user_id IS NOT NULL, 1, 0) AS is_favorite
        FROM 
          activity
        LEFT JOIN 
          activity_fav ON activity.id = activity_fav.act_id AND activity_fav.user_id = ?
        WHERE 
          activity.start_at > ? 
          AND activity.valid = 1
        ORDER BY activity.id ASC
      `
    } else {
      return res.status(400).json({ error: '無效的狀態參數' })
    }

    const [rows] = await db.query(query, [userId, currentDate])

    if (rows.length === 0) {
      return res.status(404).json({ error: '活動未找到' })
    }

    res.json(rows) // 返回所有符合條件的活動
  } catch (error) {
    console.error('Failed to fetch activity details:', error)
    res.status(500).json({ error: '無法獲取活動詳細信息' })
  }
})
//根據ID撈取單一筆活活動資料
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

    // 增加 views 欄位的值
    const updateViewsQuery =
      'UPDATE activity SET views = views + 1 WHERE id = ? AND valid = 1'
    await db.query(updateViewsQuery, [id])

    res.json(rows[0]) // 返回查詢到的活動數據
  } catch (error) {
    console.error('Failed to fetch activity details:', error)
    res.status(500).json({ error: '無法獲取活動詳細信息' })
  }
})
router.get('/top3', async (req, res) => {
  try {
    const currentDate = new Date() // 獲取當前日期

    // 查詢 views 排名前三高且開始時間比現在時間還要晚的活動
    const query = `
      SELECT * 
      FROM activity 
      WHERE start_at > ?  AND valid = 1
      ORDER BY views DESC 
      LIMIT 3
    `

    const [rows] = await db.query(query, [currentDate])

    if (rows.length === 0) {
      return res.status(404).json({ error: '活動未找到' })
    }

    res.json(rows) // 返回符合條件的前三高活動
  } catch (error) {
    console.error('Failed to fetch activity details:', error)
    res.status(500).json({ error: '無法獲取活動詳細信息' })
  }
})

router.post('/activity-reg/:userId', async (req, res) => {
  const { userId } = req.params
  const {
    ENG_name: eng_name,
    CHN_name: chn_name,
    name: applicant_name,
    phone: applicant_phone,
    date: applicant_date,
    people: applicant_amount,
    remark,
  } = req.body

  const connection = await db.getConnection()

  try {
    await connection.beginTransaction()

    // 1. 獲取 currentREG
    const [activityRows] = await connection.query(
      'SELECT currentREG FROM activity WHERE eng_name = ? AND chn_name = ?',
      [eng_name, chn_name]
    )

    if (activityRows.length === 0) {
      throw new Error('未找到對應的活動')
    }

    const currentREG = Number(activityRows[0].currentREG)
    const applicantAmount = Number(applicant_amount)
    if (isNaN(currentREG) || isNaN(applicantAmount)) {
      throw new Error('無效的數字格式')
    }

    const updatedREG = currentREG + applicantAmount

    // 2. 插入 registration_list
    await connection.query('INSERT INTO registration_list SET ?', {
      user_id: userId,
      eng_name,
      chn_name,
      applicant_name,
      applicant_phone,
      applicant_date,
      applicant_amount,
      remark,
    })

    // 3. 更新 currentREG
    await connection.query(
      'UPDATE activity SET currentREG = ? WHERE eng_name = ? AND chn_name = ?',
      [updatedREG, eng_name, chn_name]
    )

    // 4. 獲取用戶的 email
    const [userRow] = await connection.query(
      'SELECT email FROM user WHERE id = ?',
      [userId]
    )

    if (userRow.length === 0) {
      throw new Error('找不到該用戶的 Gmail 地址')
    }

    const userEmail = userRow[0].email

    // 5. 發送郵件
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_TO_EMAIL, // 使用您的 Gmail 地址
        pass: process.env.SMTP_TO_PASSWORD, // 使用應用專用密碼
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `活動報名確認 - ${chn_name}`,
      html: `
        <p>您好 ${applicant_name}，</p>
        <p>您已成功報名參加活動：</p>
        <ul>
          <li>活動名稱：<strong>${chn_name} (${eng_name})</strong></li>
          <li>報名日期：<strong>${applicant_date}</strong></li>
          <li>報名人數：<strong>${applicant_amount}</strong></li>
        </ul>
        <p>備註：${remark || '無'}</p>
        <p>感謝您的參加！</p>
      `,
    }

    await transporter.sendMail(mailOptions)

    await connection.commit()
    res.status(200).json({
      message: '報名成功，確認郵件已發送',
      updatedREG,
      applicant: { applicant_name, applicant_date, applicant_amount },
    })
  } catch (error) {
    await connection.rollback()
    console.error('操作錯誤:', error)
    res.status(400).json({ error: error.message || '操作失敗' })
  } finally {
    connection.release()
  }
})
router.get('/reg/:userId', async (req, res) => {
  const { userId } = req.params // 获取请求参数中的 userId
  try {
    const sqlSelect = `
      SELECT 
        registration_list.*,
        activity.img1 
      FROM 
        registration_list
      JOIN 
        activity 
      ON 
        registration_list.eng_name = activity.eng_name
        AND registration_list.chn_name = activity.chn_name
      WHERE 
        registration_list.user_id = ?
    `

    const [rows] = await db.query(sqlSelect, [userId])
    res.status(200).json(rows) // 返回用户报名的活动列表，包含 img1
  } catch (error) {
    console.error('查找報名活動失敗:', error)
    res.status(500).json({ error: '伺服器錯誤，無法查找報名活動' })
  }
})

// 添加收藏
router.post('/favorite', async (req, res) => {
  const { activityId, userId } = req.body
  try {
    const sqlInsert = `INSERT INTO activity_fav (act_id, user_id) VALUES (?, ?)`
    await db.query(sqlInsert, [activityId, userId])
    res.status(200).json({ message: '成功添加收藏' })
  } catch (error) {
    console.error('添加收藏失敗:', error)
    res.status(500).json({ error: '伺服器錯誤，無法添加收藏' })
  }
})
//會員中心撈收藏資料用(針對特定user做撈取)
router.get('/favorite/:userId', async (req, res) => {
  const { userId } = req.params // 获取请求参数中的 userId
  try {
    const sqlSelect = `
      SELECT activity.*
      FROM activity_fav
      JOIN activity ON activity_fav.act_id = activity.id
      WHERE activity_fav.user_id = ?
    `

    const [rows] = await db.query(sqlSelect, [userId])
    res.status(200).json(rows) // 返回收藏的活动列表
  } catch (error) {
    console.error('查找收藏活動失敗:', error)
    res.status(500).json({ error: '伺服器錯誤，無法查找收藏活動' })
  }
})

// 取消收藏
router.delete('/unfavorite', async (req, res) => {
  const { activityId, userId } = req.body
  try {
    const sqlDelete = `DELETE FROM activity_fav WHERE act_id = ? AND user_id = ?`
    await db.query(sqlDelete, [activityId, userId])
    res.status(200).json({ message: '成功取消收藏' })
  } catch (error) {
    console.error('取消收藏失敗:', error)
    res.status(500).json({ error: '伺服器錯誤，無法取消收藏' })
  }
})

// 獲取所有活動數據(根據每個用戶的收藏顯示出活動列表)
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId

  try {
    const [rows] = await db.query(
      `
      SELECT 
        activity.*, 
        IF(activity_fav.user_id IS NOT NULL, 1, 0) AS is_favorite
      FROM 
        activity
      LEFT JOIN 
        activity_fav ON activity.id = activity_fav.act_id AND activity_fav.user_id = ?
      WHERE 
        activity.valid = 1
      ORDER BY 
        activity.id ASC
    `,
      [userId]
    )

    res.json(rows)
  } catch (error) {
    console.error('Failed to fetch activity:', error)
    res.status(500).json({ error: 'Failed to fetch activity' })
  }
})

// 獲取特定月份的活動數據(登出的路由)
// router.get('/month/:month', async (req, res) => {
//   const { month } = req.params // 獲取路徑參數中的 month
//   try {
//     const [rows] = await db.query(
//       'SELECT * FROM activity WHERE MONTH(start_at) = ? AND valid = 1',
//       [month]
//     )

//     if (rows.length === 0) {
//       return res.status(404).json({ error: '活動未找到' })
//     }

//     res.json(rows) // 返回所有符合條件的活動
//   } catch (error) {
//     console.error('Failed to fetch activity details:', error)
//     res.status(500).json({ error: '無法獲取活動詳細信息' })
//   }
// })
router.get('/month/:month/:userId', async (req, res) => {
  const { month, userId } = req.params // 获取路径参数中的 month 和 userId

  try {
    const [rows] = await db.query(
      `
      SELECT 
        activity.*, 
        IF(activity_fav.user_id IS NOT NULL, 1, 0) AS is_favorite
      FROM 
        activity
      LEFT JOIN 
        activity_fav ON activity.id = activity_fav.act_id AND activity_fav.user_id = ?
      WHERE 
        MONTH(activity.start_at) = ? 
        AND activity.valid = 1
      ORDER BY 
        activity.id ASC
      `,
      [userId, month]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: '活動未找到' })
    }

    res.json(rows) // 返回所有符合条件的活动
  } catch (error) {
    console.error('Failed to fetch activity details:', error)
    res.status(500).json({ error: '無法獲取活動詳細信息' })
  }
})

export default router
