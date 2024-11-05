import express from 'express'
import db from '##/configs/mysql.js'
import multer from 'multer'
// 檢查空物件, 轉換req.params為數字
import { getIdParam } from '#db-helpers/db-tool.js'
import jsonwebtoken from 'jsonwebtoken'
// 中介軟體，存取隱私會員資料用
import authenticate from '#middlewares/authenticate.js'
import { generateHash, compareHash } from '##/db-helpers/password-hash.js'

const upload = multer()
const router = express.Router()
// 檢查空物件, 轉換req.params為數字
// import { getIdParam } from '#db-helpers/db-tool.js'

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
      name, account, password, email, gender, phone, address, img, level, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ' ', ' ', 'avatar01.jpg', ' ', '1', NOW(), NULL
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
router.post('/login', async (req, res) => {
  console.log(req.body)
  const loginUser = req.body
  // 1.先用account查詢該會員

  const [rows] = await db.query('SELECT * FROM user WHERE account = ?', [
    loginUser.account,
  ])

  if (rows.length === 0) {
    return res.json({ status: 'error', message: '該會員不存在' })
  }

  const dbUser = rows[0]

  // 2. 比對密碼hash是否相同(返回true代表密碼正確)
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
    // google_uid: user.google_uid,
    // line_uid: user.line_uid,
  }

  // 讓會員保持登陸3天
  // 產生存取令牌(access token)，其中包含會員資料
  const accessToken = jsonwebtoken.sign(returnUser, accessTokenSecret, {
    expiresIn: '3d',
  })

  // 使用httpOnly cookie來讓瀏覽器端儲存access token
  res.cookie('accessToken', accessToken, { httpOnly: true })

  // 傳送access token回應(例如react可以儲存在state中使用)
  return res.json({
    status: 'success',
    data: { accessToken },
  })
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
  // upload.single('img'), // 上傳來的檔案(這是單個檔案，表單欄位名稱為avatar)
  async (req, res) => {
    // id可以用jwt的存取令牌(accessToken)從authenticate中得到(如果有登入的話)
    const id = req.user.id

    // 這裡可以檢查
    const updateUser = req.body

    let result = null

    // 這是一起更新密碼的寫法
    // if (updateUser.password) {
    //   result = await db.query(
    //     'UPDATE `user` SET `name`=?,`password`=?,`email`=? WHERE `id`=?;',
    //     [updateUser.name, updateUser.password, updateUser.email, id]
    //   )
    // } else {
    //   result = await db.query(
    //     'UPDATE `user` SET `name`=?,`email`=? WHERE `id`=?;',
    //     [updateUser.name, updateUser.email, id]
    //   )
    // }

    // const imgFileName = req.file ? req.file.filename : updateUser.img

    // 更新除了帳號密碼以外的資料的寫法
    result = await db.query(
      'UPDATE `user` SET `name`=?, `email`=?, `nickname`=?, `img`=?, `gender`=?, `phone`=?, `address`=?,birthday=? ,`updated_at`=? WHERE `id`=?;',
      [
        updateUser.name,
        updateUser.email,
        updateUser.nickname,
        updateUser.img,
        // imgFileName, // 使用上傳的檔案名稱
        updateUser.gender,
        updateUser.phone,
        updateUser.address,
        updateUser.birthday,
        new Date(),
        id,
      ]
    )

    const [rows2] = result
    console.log(rows2)

    // 檢查是否有產生影響欄位affectedRows，代表新增成功
    if (rows2.affectedRows) {
      return res.json({ status: 'success', data: null })
    } else {
      return res.json({ status: 'error', message: '更新到資料庫失敗' })
      // 沒有更新
    }
  }
)

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
  // const [affectedRows] = await User.update(
  //   { password: userPassword.new },
  //   {
  //     where: {
  //       id,
  //     },
  //     individualHooks: true, // 更新時要加密密碼字串 trigger the beforeUpdate hook
  //   }
  // )

  // 沒有更新到任何資料 -> 失敗
  if (!affectedRows) {
    return res.json({ status: 'error', message: '更新失敗' })
  }

  // 成功，不帶資料
  return res.json({ status: 'success', data: null })
})

export default router
