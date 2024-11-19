import express from 'express'
import db from '##/configs/mysql.js'
import multer from 'multer'
import path from 'path'
// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'
import jsonwebtoken from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'
import { generateHash, compareHash } from '##/db-helpers/password-hash.js'
import { fileURLToPath } from 'url'

// const upload = multer()
const router = express.Router()

// // multer的設定值 - START
// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     // 存放目錄
//     callback(null, 'public/avatar/')
//   },
//   filename: function (req, file, callback) {
//     // 經授權後，req.user帶有會員的id
//     const newFilename = req.user.id
//     // 新檔名由表單傳來的req.body.newFilename決定
//     callback(null, newFilename + path.extname(file.originalname))
//   },
// })
// const upload = multer({ storage: storage })
// // multer的設定值 - END
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    const uploadPath = path.join(__dirname, '../public/avatar/')
    console.log('Upload path:', uploadPath)
    callback(null, uploadPath)
  },
  filename: function (req, file, callback) {
    // 取得用戶ID，並將 1 到 9 的 ID 進行補零處理
    let userId = req.user.id
    if (userId >= 1 && userId <= 9) {
      userId = `0${userId}`
    }
    // 取得文件擴展名
    const ext = path.extname(file.originalname)
    // 組合新的文件名，格式為avatar用戶ID.擴展名
    const newFilename = `avatar${userId}${ext}`
    console.log('New filename:', newFilename)
    callback(null, newFilename)
  },
})

const upload = multer({ storage: storage })

// 定義安全的私鑰字串
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/', authenticate, async function (req, res) {
  // id可以用jwt的存取令牌(accessToken)從authenticate中得到(如果有登入的話)
  const id = req.user.id

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  // if (req.user.id !== id) {
  //   return res.json({ status: 'error', message: '存取會員資料失敗' })
  // }

  const [rows] = await db.query('SELECT * FROM user WHERE id= ?', [id])

  if (rows.length === 0) {
    return res.json({ status: 'error', message: '沒有找到會員資料' })
  }
  const user = rows[0]
  // 不回傳密碼
  delete user.password
  return res.json({ status: 'success', data: { user } })
})

// 註冊
router.post('/register', upload.none(), async (req, res) => {
  try {
    const { email, password, name, account } = req.body

    // 4. 看要執行的 SQL 值
    // console.log('準備插入的值:', [email, password, name, account])
    // 檢查是否已經有相同的email
    // console.log('開始資料庫操作')
    // 帳號密碼重複認證
    const [existingUser] = await db.query(
      'SELECT * FROM user WHERE email = ? OR account = ?',
      [email, account]
    )

    if (existingUser.length > 0) {
      return res.json({
        status: 'error',
        message: '電子郵件或帳號已被註冊',
      })
    }

    const hashedPassword = await generateHash(password)

    const sql = `
    INSERT INTO user (
      name, account, password, email, gender, phone, img, address, level,identity, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ' ', ' ', 'avatar01.jpg', ' ', '1','user', NOW(), NULL
    )
  `
    const params = [name, account, hashedPassword, email]

    const [result] = await db.query(sql, params)
    console.log('插入結果:', result)

    if (result.affectedRows === 1) {
      return res.json({
        status: 'success',
        message: '註冊成功',
        userId: result.insertId,
      })
    } else {
      throw new Error('資料插入失敗')
    }
  } catch (error) {
    console.error('SQL Error:', error)
    return res.status(500).json({
      status: 'error',
      message: error.message || '伺服器錯誤',
    })
  }
})

// 登入
router.post(`/login/:role`, async (req, res) => {
  console.log(req.body)
  const loginUser = req.body
  const role = req.params.role // 獲取路徑中的身份

  // 1.先用account查詢該會員並判斷是否有軟刪除
  const [rows] = await db.query(
    'SELECT * FROM user WHERE account = ? AND valid = 1',
    [loginUser.account]
  )

  if (rows.length === 0) {
    return res.json({ status: 'error', message: '該會員不存在' })
  }

  const dbUser = rows[0]
  // 2. 檢查該會員的身份是否符合登入要求
  console.log(`Database Identity: ${dbUser.identity}, Provided Role: ${role}`)

  if (dbUser.identity !== role) {
    if (role === 'teacher') {
      return res.json({ status: 'error', message: '無教師權限' })
    } else if (role === 'admin') {
      return res.json({ status: 'error', message: '無管理員權限' })
    } else {
      return res.json({ status: 'error', message: '身份不符合' })
    }
  }
  // 3. 比對密碼hash是否相同(返回true代表密碼正確)
  const isValid = await compareHash(loginUser.password, dbUser.password)

  if (!isValid) {
    return res.json({ status: 'error', message: '密碼錯誤' })
  }
  // console.log(dbUser)
  // 存取令牌(access token)只需要id和username就足夠，其它資料可以再向資料庫查詢
  // 不會修改的資料，避免使用者修改後又要重發
  const returnUser = {
    id: dbUser.id,
    account: dbUser.account,
    identity: dbUser.identity,
    google_uid: dbUser.google_uid,
    line_uid: dbUser.line_uid,
  }

  // 讓會員保持登陸3天
  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, { httpOnly: true })

  // 傳送access token回應(例如react可以儲存在state中使用)
  res.json({ status: 'success', accessToken, user: returnUser })
  // return res.json({ status: 'success', data: null })
})

// 登出
router.post('/logout', authenticate, (req, res) => {
  // 清除cookie
  res.clearCookie('accessToken', { httpOnly: true })
  res.json({ status: 'success', data: null })
})

// 更新會員資料
router.put(
  '/',
  authenticate,
  upload.single('avatar'), // 上傳來的檔案(這是單個檔案，表單欄位名稱為avatar)
  async (req, res) => {
    const id = req.user.id
    const updateUser = req.body

    console.log('更新請求的使用者ID:', id)
    console.log('更新請求的數據:', updateUser)

    // 取得使用者現有的頭貼
    const [users] = await db.query('SELECT * FROM user WHERE id = ?', [id])
    if (users.length === 0) {
      console.log('找不到該用戶')
      return res.status(404).json({ status: 'error', message: '找不到該用戶' })
    }

    // 使用者現有的頭貼
    const currentImagePath = users[0].img
    console.log('使用者現有的頭貼:', currentImagePath)

    // 如果有上傳新頭貼，則使用新頭貼，否則保留現有頭貼
    const imgFileName = req.file ? req.file.filename : currentImagePath
    console.log('Image file name:', imgFileName)

    // 更新除了帳號密碼以外的資料
    try {
      const [result] = await db.query(
        'UPDATE `user` SET `name`=?, `email`=?, `nickname`=?, `img`=?, `gender`=?, `phone`=?,`city`=?, `area`=?, `address`=?, `birthday`=?, `updated_at`=? WHERE `id`=?;',
        [
          updateUser.name,
          updateUser.email,
          updateUser.nickname,
          imgFileName,
          updateUser.gender,
          updateUser.phone,
          updateUser.city,
          updateUser.area,
          updateUser.address,
          updateUser.birthday,
          new Date(),
          id,
        ]
      )

      console.log('Database update result:', result)

      if (result.affectedRows === 0) {
        console.log('更新失敗: 找不到該用戶')
        return res
          .status(404)
          .json({ status: 'error', message: '找不到該用戶' })
      }

      if (req.file) {
        console.log('會員頭像及資料更新成功')
        return res.json({
          status: 'success',
          message: '會員頭像及資料更新成功',
          data: { img: imgFileName },
        })
      } else {
        console.log('會員資料更新成功')
        return res.json({
          status: 'success',
          message: '會員資料更新成功',
          data: { img: imgFileName },
        })
      }
    } catch (error) {
      console.error('更新失敗:', error)
      return res.status(500).json({ status: 'error', message: '更新失敗' })
    }
  }
)

// // 更新會員檔案
// router.post(
//   '/upload-avatar',
//   authenticate,
//   upload.single('img'),
//   async (req, res) => {
//     console.log(req.file, req.body)

//     if (req.file) {
//       const id = req.user.id
//       const data = { img: req.file.filename }

//       // 對資料庫執行update
//       const [affectedRows] = await db.query(
//         'UPDATE user SET img = ? WHERE id = ?'[(data.img, id)]
//       )
//       if (!affectedRows) {
//         return res.json({ status: 'error', message: '更新失敗' })
//       }
//       return res.json({ status: 'success', data: null })
//     }
//   }
// )

// =================================================================
// post - 會員密碼更新
// PUT - 更新會員資料(密碼更新用)
router.put('/:id/password', authenticate, async function (req, res) {
  const id = getIdParam(req)

  // 檢查是否為授權會員，只有授權會員可以存取自己的資料
  if (req.user.id !== id) {
    return res.json({ status: 'error', message: '存取會員資料失敗' })
  }

  // user為來自前端的會員資料(準備要修改的資料)
  const userPassword = req.body
  // 檢查從前端瀏覽器來的資料，哪些為必要(name, ...)，從前端接收的資料為
  // {
  //   originPassword: '', // 原本密碼，要比對成功才能修改
  //   newPassword: '', // 新密碼
  // }
  if (!id || !userPassword.origin || !userPassword.new) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // const [rows] = await db.query('SELECT * FROM user WHERE account = ?', [
  //   loginUser.account,
  // ])
  // 查詢資料庫目前的資料
  const [rows] = await db.query('SELECT password FROM user WHERE id = ?', [id])
  const dbUser = rows[0]
  // const dbUser = await User.findByPk(id, {
  //   raw: true, // 只需要資料表中資料
  // })

  // null代表不存在
  if (!dbUser) {
    return res.json({ status: 'error', message: '使用者不存在' })
  }

  // compareHash(登入時的密碼純字串, 資料庫中的密碼hash) 比較密碼正確性
  // isValid=true 代表正確
  const isValid = await compareHash(userPassword.origin, dbUser.password)

  // isValid=false 代表密碼錯誤
  if (!isValid) {
    return res.json({ status: 'error', message: '密碼錯誤' })
  }

  const hashedPassword = await generateHash(userPassword.new)

  // 對資料庫執行update
  const [affectedRows] = await db.query(
    'UPDATE user SET password = ? WHERE id = ?',
    [hashedPassword, id]
  )

  // 沒有更新到任何資料 -> 失敗
  if (!affectedRows) {
    return res.json({ status: 'error', message: '更新失敗' })
  }

  // 成功，不帶資料
  return res.json({ status: 'success', data: null })
})
// =================================================================

// 軟刪除會員
router.delete('/:id', function (req, res) {
  const id = req.params.id
  const sql = 'UPDATE user SET valid = 0 WHERE id = ?'
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: '刪除資料錯誤', error: err })
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: 'fail',
        message: '無法更新 valid 欄位。',
      })
    }

    // 成功
    return res.json({ status: 'success', data: null })
  })
})

// 新增訂單並更新會員等級============================
// router.post('/order', authenticate, async (req, res) => {
//   try {
//     const { total_amount } = req.body
//     const userId = req.user.id // 使用登入會員的ID

//     // 插入訂單資料
//     const insertOrderSql = `
//       INSERT INTO order_list (user_id, total_amount)
//       VALUES (${userId}, ${total_amount})
//     `
//     const [orderResult] = await db.query(insertOrderSql)

//     if (orderResult.affectedRows === 1) {
//       // 更新會員等級
//       const updateLevelSql = `
//         UPDATE user u
//         JOIN order_list o ON u.id = o.user_id
//         SET u.level = CASE
//           WHEN o.total_amount >= 20000 THEN 3
//           WHEN o.total_amount >= 6000 THEN 2
//           ELSE 1
//         END
//         WHERE o.id = ${orderResult.insertId}
//       `
//       await db.query(updateLevelSql)

//       return res.json({
//         status: 'success',
//         message: '訂單新增成功並更新會員等級',
//         orderId: orderResult.insertId,
//       })
//     } else {
//       throw new Error('訂單插入失敗')
//     }
//   } catch (error) {
//     console.error('Error:', error)
//     return res.status(500).json({
//       status: 'error',
//       message: error.message || '伺服器錯誤',
//     })
//   }
// })

// 新增訂單並更新會員等級
router.post('/order', authenticate, async (req, res) => {
  try {
    const { total_amount } = req.body
    const userId = req.user.id // 使用登入會員的ID

    // 插入訂單資料
    const insertOrderSql = `
      INSERT INTO order_list (user_id, total_amount)
      VALUES (${userId}, ${total_amount})
    `
    const [orderResult] = await db.query(insertOrderSql)

    if (orderResult.affectedRows === 1) {
      // 計算總消費金額
      const totalSpentSql = `
        SELECT SUM(total_amount) as total_spent
        FROM order_list
        WHERE user_id = ${userId}
      `
      const [totalResult] = await db.query(totalSpentSql)
      const totalSpent = totalResult[0].total_spent

      // 更新會員等級
      const updateLevelSql = `
        UPDATE user
        SET level = CASE
          WHEN ${totalSpent} >= 20000 THEN 3
          WHEN ${totalSpent} >= 6000 THEN 2
          ELSE 1
        END
        WHERE id = ${userId}
      `
      await db.query(updateLevelSql)

      return res.json({
        status: 'success',
        message: '訂單新增成功並更新會員等級',
        orderId: orderResult.insertId,
      })
    } else {
      throw new Error('訂單插入失敗')
    }
  } catch (error) {
    console.error('Error:', error)
    return res.status(500).json({
      status: 'error',
      message: error.message || '伺服器錯誤',
    })
  }
})

export default router
