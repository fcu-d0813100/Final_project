import express from 'express'
const router = express.Router()
import db from '#configs/db.js'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

router.use('/upload', express.static(path.join(__dirname, 'public/upload')))

// create post - post
router.post('/create', upload.array('files'), async function (req, res, next) {
  try {
    const { userId, title, content, tags } = req.body
    const uploadedFiles = req.files.map((file) => file.filename)
    console.log('Uploaded files:', req.files)

    // post table 插入貼文
    const sqlInsertPost = `
        INSERT INTO post (user_id, title, content, created_at) VALUES (${userId}, '${title}', '${content}', NOW())
      `
    const [postResult] = await db.query(sqlInsertPost)
    const postId = postResult
    // console.log(postResult)

    // post_tag table 查詢已有標籤並去重
    if (tags) {
      const tagsArray = Array.isArray(tags)
        ? tags
        : tags.split(',').map((tag) => tag.trim())
      const sqlSelectExistingTags = `
        SELECT id, name FROM post_tag WHERE name IN (${tagsArray.map((tag) => `'${tag}'`).join(', ')})
      `
      const [existingTags] = await db.query(sqlSelectExistingTags)
      const existingTagsIds = existingTags.map((tag) => tag.id)
      const existingTagsNames = new Set(existingTags.map((tag) => tag.name))

      const newTags = tagsArray.filter((tag) => !existingTagsNames.has(tag))
      let newTagIds = []

      // 插入新標籤
      if (newTags.length > 0) {
        const sqlInsertTag = `
          INSERT INTO post_tag (name) VALUES ${newTags.map((tag) => `('${tag}')`).join(', ')}
        `
        const [newTagsResult] = await db.query(sqlInsertTag)
        const firstNewTagId = newTagsResult
        newTagIds = Array.from(
          { length: newTags.length },
          (_, i) => firstNewTagId + i
        )
      }

      const tagIds = [...existingTagsIds, ...newTagIds]

      // post_tag_relation table 插入標籤關係
      const sqlInsertTagRelation = `
        INSERT INTO post_tag_relation (post_id, tag_id) VALUES ${tagIds
          .map((tagId) => `(${postId}, ${tagId})`)
          .join(', ')}
      `
      await db.query(sqlInsertTagRelation)
    }
    // post_image table 插入圖片
    if (uploadedFiles.length > 0) {
      const sqlInsertImage = `
          INSERT INTO post_image (post_id, user_id, pic, uploaded_at) VALUES ${uploadedFiles
            .map((pic) => `(${postId}, ${userId}, '${pic}', NOW())`)
            .join(', ')}
        `
      await db.query(sqlInsertImage)
      console.log(sqlInsertImage)
    }

    res.json({
      status: 'success',
      message: `ID:${postId} 貼文、圖片和標籤插入成功`,
    })
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({
      status: 'error',
      message: '貼文創建失敗',
    })
  }
})

// update post - put
router.put('/update', upload.array('files'), async function (req, res, next) {
  try {
    const { postId, userId, title, content, tags, imgs } = req.body
    const uploadedFiles = req.files.map((file) => file.filename)
    console.log('Uploaded files:', req.files)
    console.log(imgs)
    // post table 更新貼文
    const sqlUpdatePost = `
    UPDATE post SET title = '${title}', content = '${content}', created_at = NOW() WHERE id = ${postId} AND user_id = ${userId}
  `
    await db.query(sqlUpdatePost)

    // post_tag table 查詢已有標籤並去重
    if (tags) {
      const tagsArray = Array.isArray(tags)
        ? tags
        : tags.split(',').map((tag) => tag.trim())
      const sqlSelectExistingTags = `
        SELECT id, name FROM post_tag WHERE name IN (${tagsArray.map((tag) => `'${tag}'`).join(', ')})
      `
      const [existingTags] = await db.query(sqlSelectExistingTags)
      const existingTagsIds = existingTags.map((tag) => tag.id)
      const existingTagsNames = new Set(existingTags.map((tag) => tag.name))

      const newTags = tagsArray.filter((tag) => !existingTagsNames.has(tag))
      let newTagIds = []

      // 插入新標籤
      if (newTags.length > 0) {
        const sqlInsertTag = `
          INSERT INTO post_tag (name) VALUES ${newTags.map((tag) => `('${tag}')`).join(', ')}
        `
        const [newTagsResult] = await db.query(sqlInsertTag)
        const firstNewTagId = newTagsResult
        newTagIds = Array.from(
          { length: newTags.length },
          (_, i) => firstNewTagId + i
        )
      }

      const tagIds = [...existingTagsIds, ...newTagIds]

      // post_tag_relation table
      // 先刪除舊標籤關係
      const sqlDeleteTagRelation = `
        DELETE FROM post_tag_relation WHERE post_id = ${postId}
      `
      await db.query(sqlDeleteTagRelation)
      // 再插入新標籤關係
      const sqlInsertTagRelation = `
        INSERT INTO post_tag_relation (post_id, tag_id) VALUES ${tagIds
          .map((tagId) => `(${postId}, ${tagId})`)
          .join(', ')}
      `
      await db.query(sqlInsertTagRelation)
    }
    // post_image table
    if (uploadedFiles.length > 0) {
      // 先刪除舊圖片 imgs → 找出保留的圖片 + 再刪除未保留的圖片
      if (imgs) {
        const oldimgsArr = Array.isArray(imgs)
          ? imgs
          : imgs.split(',').map((img) => img.trim())
        console.log(oldimgsArr)
        const sqlDeleteImage = `
        DELETE FROM post_image WHERE post_id = ${postId} AND pic NOT IN (${oldimgsArr.map((img) => `'${img}'`).join(', ')})
        `
        await db.query(sqlDeleteImage)
      }

      // 再插入新圖片 files
      const sqlInsertImage = `
      INSERT INTO post_image (post_id, user_id, pic, uploaded_at) VALUES ${uploadedFiles
        .map((pic) => `(${postId}, ${userId}, '${pic}', NOW())`)
        .join(', ')}
      `
      await db.query(sqlInsertImage)
      console.log(sqlInsertImage)
    } else {
      if (imgs) {
        const oldimgsArr = Array.isArray(imgs)
          ? imgs
          : imgs.split(',').map((img) => img.trim())
        console.log(oldimgsArr)
        const sqlDeleteImage = `
        DELETE FROM post_image WHERE post_id = ${postId} AND pic NOT IN (${oldimgsArr.map((img) => `'${img}'`).join(', ')})
        `
        await db.query(sqlDeleteImage)
      }
    }

    res.json({
      status: 'success',
      message: `ID:${postId} 貼文、圖片和標籤更新成功`,
    })
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({
      status: 'error',
      message: '貼文更新失敗',
    })
  }
})

// delete post - delete
router.put('/delete', async function (req, res, next) {
  const { postId, userId } = req.body
  const sqlUpdate = `UPDATE post SET status = 0 WHERE id = ${postId} AND user_id = ${userId}`
  console.log(sqlUpdate)
  await db.query(sqlUpdate)
  res.json({ status: 'success', message: '刪除貼文成功' })
})

// check if post is liked - render
router.get('/:postId/:userId/isLiked', async (req, res) => {
  const { postId, userId } = req.params

  try {
    // 檢查是否已按讚
    const [existingLike] = await db.query(
      `SELECT * FROM post_like WHERE user_id = ${userId} AND post_id = ${postId}`,
      [userId, postId]
    )

    if (existingLike.length > 0) {
      return res.status(200).json({ isLiked: true, message: '已按讚此貼文' })
    } else {
      return res.status(200).json({ isLiked: false, message: '尚未按讚此貼文' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '伺服器錯誤，無法檢查按讚狀態' })
  }
})

// like post - like 未按讚 → 加入按讚
router.post('/:postId/:userId/like', async (req, res) => {
  const { postId, userId } = req.params
  try {
    const sqlInsert = `INSERT INTO post_like (post_id, user_id) VALUES (${postId}, ${userId})`
    await db.query(sqlInsert, [postId, userId])
    res.json({ status: 'success', message: '按讚成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '伺服器錯誤，無法更新按讚狀態' })
  }
})
// like post - unlike 已按讚 → 取消按讚
router.delete('/:postId/:userId/dislike', async (req, res) => {
  const { postId, userId } = req.params
  try {
    const sqlDelete = `DELETE FROM post_like WHERE post_id = ${postId} AND user_id = ${userId}`
    await db.query(sqlDelete, [postId, userId])
    res.json({ status: 'success', message: '取消按讚成功' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '伺服器錯誤，無法更新按讚狀態' })
  }
})

// check if post is saved post - render
router.get('/:postId/:userId/isSaved', async (req, res) => {
  const { postId, userId } = req.params
  try {
    const existingSave = await db.query(
      `SELECT * FROM post_save WHERE user_id = ${userId} AND post_id = ${postId}`,
      [userId, postId]
    )

    if (existingSave.length > 0) {
      return res.status(400).json({ message: '已收藏此貼文' })
    }

    // 插入收藏
    await db.query(
      `INSERT INTO post_save (user_id, post_id, created_at) VALUES (${userId}, ${postId} NOW())`,
      [userId, postId]
    )
  } catch (err) {
    console.error(err)
    res.json(500).json({ error: '伺服器錯誤，無法檢查收藏狀態' })
  }
})
// save post - toggle
router.get('/:postId/:userId/save', async (req, res) => {
  const { postId, userId } = req.params

  try {
    // 檢查是否已收藏
    const sqlCheck = `SELECT * FROM post_save WHERE post_id = ? AND user_id = ?`
    const [rows] = await db.query(sqlCheck, [postId, userId])

    if (rows.length > 0) {
      // 已收藏 → 取消收藏
      const sqlDelete = `DELETE FROM post_save WHERE post_id = ? AND user_id = ?`
      await db.query(sqlDelete, [postId, userId])
      res.json({ status: 'success', message: '取消收藏成功' })
    } else {
      // 未收藏 → 加入收藏
      const sqlInsert = `INSERT INTO post_save (post_id, user_id) VALUES (?, ?)`
      await db.query(sqlInsert, [postId, userId])
      res.json({ status: 'success', message: '收藏成功' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: '伺服器錯誤，無法更新收藏狀態' })
  }
})

// like comment - render

router.post('/', async function (req, res, next) {})

// render post-wall page sort/order/search/tags
router.get('/', async function (req, res, next) {
  const {
    sort = 'total_count',
    order = 'DESC',
    search = '',
    tags = '',
    postId = '',
  } = req.query

  // console.log(tags)

  let sqlSelect = `  SELECT 
      post.*, 
      user.id AS user_id,
      user.nickname, 
      user.img AS user_img, 
      GROUP_CONCAT(DISTINCT post_tag.name) AS tags,
      COUNT(DISTINCT post_like.id) AS like_count,
      COUNT(DISTINCT post_comment.id) AS comment_count,
      (COUNT(DISTINCT post_like.id) + COUNT(DISTINCT post_comment.id)) AS total_count,
      (SELECT pic FROM post_image WHERE post_image.post_id = post.id LIMIT 1) AS post_img
    FROM 
      post
    JOIN 
      user ON post.user_id = user.id
    LEFT JOIN 
      post_like ON post.id = post_like.post_id
    LEFT JOIN
      post_comment ON post.id = post_comment.post_id
    LEFT JOIN
      post_tag_relation ON post.id = post_tag_relation.post_id
    LEFT JOIN
        post_tag ON post_tag_relation.tag_id = post_tag.id
  `
  const conditions = []
  const params = []

  //
  if (postId) {
    conditions.push(`post.id != '${postId}'`)
  }
  // search
  if (search) {
    conditions.push(
      `post.title LIKE '%${search}%' OR post.content LIKE '%${search}%' OR post_tag.name LIKE '%${search}%'`
    )
    params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    // sqlSelect += `WHERE post.title LIKE '%${search}%' OR post.content LIKE '%${search}%' OR post_tag.name LIKE '%${search}%'`
  }
  //tags
  if (tags.length > 0) {
    const tagsArray = Array.isArray(tags) ? tags : [tags]
    const tagsConditions = tagsArray
      .map((tag) => `post_tag.name LIKE '%${tag}%'`)
      .join(' OR ')
    conditions.push(`(${tagsConditions})`)
    tagsArray.forEach((tag) => params.push(`%${tag}%`))
  }
  //條件
  if (conditions.length > 0) {
    sqlSelect += ` WHERE ${conditions.join(' AND ')} `
  }

  sqlSelect += `
    GROUP BY
      post.id, user.id, user.img, user.nickname
    ORDER BY
      ${sort === 'created_at' ? 'post.created_at' : 'total_count'} ${order},post.created_at DESC; 
    `

  // console.log('SQL Query:', sqlSelect)
  // console.log('Parameters:', params)
  const [result] = await db
    .query(sqlSelect, params)
    .catch((e) => console.log(e))
  res.json(result)
})

// render post-detail 指定id
const nestComments = (comments) => {
  const map = {}
  const roots = []

  comments.forEach((comment) => {
    map[comment.comment_id] = { ...comment, children: [] }

    if (comment.parent_id === null) {
      roots.push(map[comment.comment_id])
    } else if (map[comment.parent_id]) {
      map[comment.parent_id].children.push(map[comment.comment_id])
    } else {
      console.log(`Parent comment with ID ${comment.parent_id} not found.`)
    }
  })

  return roots
}
/* 
RECURSIVE :第1次查詢的結果賦值給 CommentHierarchy 
第1次基礎查詢:查詢根評論->沒有parent_id的comment.id 
第2次遞迴查詢:查詢子評論->查找根評論是否有子評論 
重複遞迴查詢:以最新的CommentHierarchy 更新ch.comment_id，找出新加入的子評論 
ch:表示CommentHierarchy父評論  pc:表示post_comment子評論
*/
router.get('/post_wall/:postId', async function (req, res, next) {
  const sqlSelect = `
    WITH RECURSIVE CommentHierarchy AS (
      SELECT
          post_comment.id AS comment_id,
          post_comment.parent_id,
          post_comment.post_id,
          post_comment.user_id,
          post_comment.content AS comment_content,
          post_comment.created_at AS comment_created_at,
          user.nickname AS comment_author_nickname,
          user.img AS comment_author_img,
          1 AS depth,
          (SELECT COUNT(*) FROM post_comment_like WHERE post_comment_like.comment_id = post_comment.id) AS like_count,
          (SELECT COUNT(*) FROM post_comment WHERE post_comment.parent_id = post_comment.id) AS comment_count
      FROM
          post_comment
      JOIN
          user ON post_comment.user_id = user.id
      WHERE
          post_comment.post_id = ${req.params.postId}
          AND post_comment.parent_id IS NULL

      UNION ALL

      SELECT
          pc.id AS comment_id,
          pc.parent_id,
          pc.post_id,
          pc.user_id,
          pc.content AS comment_content,
          pc.created_at AS comment_created_at,
          u.nickname AS comment_author_nickname,
          u.img AS comment_author_img,
          ch.depth + 1 AS depth,
          (SELECT COUNT(*) FROM post_comment_like WHERE post_comment_like.comment_id = pc.id) AS like_count,
          (SELECT COUNT(*) FROM post_comment WHERE post_comment.parent_id = pc.id) AS comment_count
      FROM
          post_comment AS pc
      JOIN
          CommentHierarchy AS ch ON pc.parent_id = ch.comment_id
      JOIN
          user AS u ON pc.user_id = u.id
    )

    SELECT
        post.*,
        post_author.id AS post_author_id,
        post_author.img AS post_author_img,
        post_author.nickname AS post_author_nickname,
        GROUP_CONCAT(DISTINCT post_image.pic) AS post_imgs,
        GROUP_CONCAT(DISTINCT post_tag.name) AS tags,
        COUNT(DISTINCT post_like.id) AS like_count,
        COUNT(DISTINCT post_save.id) AS save_count,
        (SELECT COUNT(*) FROM post_comment WHERE post_comment.post_id = ${req.params.postId}) AS comment_count,
        CommentHierarchy.comment_id,
        CommentHierarchy.comment_content,
        CommentHierarchy.parent_id,
        CommentHierarchy.comment_created_at,
        CommentHierarchy.comment_author_nickname,
        CommentHierarchy.comment_author_img,
        CommentHierarchy.depth,
        CommentHierarchy.like_count AS comment_like_count,
        CommentHierarchy.comment_count AS comment_reply_count
    FROM
        post
    JOIN
        user AS post_author ON post.user_id = post_author.id
    LEFT JOIN
        post_like ON post.id = post_like.post_id
    LEFT JOIN
        post_save ON post.id = post_save.post_id
    LEFT JOIN
        post_image ON post.id = post_image.post_id
    LEFT JOIN
        post_tag_relation ON post.id = post_tag_relation.post_id
    LEFT JOIN
        post_tag ON post_tag_relation.tag_id = post_tag.id
    LEFT JOIN
        CommentHierarchy ON post.id = CommentHierarchy.post_id
    WHERE
        post.id = ${req.params.postId} AND post.status = 1
    GROUP BY
        post.id,
        post_author.id,
        CommentHierarchy.comment_id
  `
  const [result] = await db.query(sqlSelect)
  const flatComments = result.map((row) => ({
    comment_id: row.comment_id,
    parent_id: row.parent_id,
    comment_content: row.comment_content,
    created_at: row.comment_created_at,
    comment_author_nickname: row.comment_author_nickname,
    comment_author_img: row.comment_author_img,
    comment_like_count: row.comment_like_count,
    comment_reply_count: row.comment_reply_count,
    depth: row.depth,
  }))
  // 刪除未被嵌套的評論
  const nextPost = result.map(
    ({
      comment_id,
      comment_content,
      parent_id,
      comment_created_at,
      comment_author_nickname,
      comment_author_img,
      comment_like_count,
      comment_reply_count,
      ...others
    }) => others
  )

  // console.log(nextPostData)
  const nestedComments = nestComments(flatComments)
  const post = {
    ...nextPost[0],
    comments: nestedComments,
  }
  res.json({ status: 'success', post })
})

// render user-post-publish 指定id的user
router.get('/post_publish/:userId', async function (req, res, next) {
  const sqlSelect = `SELECT 
        post.id, 
        post.title, 
        post.content,
        post.created_at,
        post.status,
        user.id AS user_id,
        user.img AS user_img, 
        (SELECT COUNT(*) FROM post_like WHERE post_like.post_id = post.id) AS like_count,
        COUNT(DISTINCT post_comment.id) AS comment_count,
        
        
        (SELECT pic FROM post_image WHERE post_image.post_id = post.id LIMIT 1) AS post_img
      FROM 
        post
      JOIN 
        user ON post.user_id = user.id
      
      LEFT JOIN 
        post_like ON post.id = post_like.post_id
      LEFT JOIN
        post_comment ON post.id = post_comment.post_id
      WHERE 
      user.id = ${req.params.userId} AND post.status = 1
      GROUP BY    
        post.id, user.id, user.img, user.nickname
      ORDER BY 
        post.created_at DESC
      LIMIT 10`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// render user-post-save 指定id的user
router.get('/post_save/:userId', async function (req, res, next) {
  const sqlSelect = `SELECT 
        post.id, 
        post.title,
        post.status, 
        user.id AS user_id,
        user.nickname, 
        user.img AS user_img, 
        (SELECT COUNT(*) FROM post_like WHERE post_like.post_id = post.id) AS like_count,
        (SELECT pic FROM post_image WHERE post_image.post_id = post.id LIMIT 1) AS post_img
      FROM 
        post
      JOIN 
        user ON post.user_id = user.id
      LEFT JOIN 
        post_like ON post.id = post_like.post_id
      JOIN 
        post_save ON post.id = post_save.post_id
      WHERE
        post.id IN (SELECT post_id FROM post_save WHERE user_id = ${req.params.userId}  AND post.status = 1)
      GROUP BY    
        post.id, user.id, user.img, user.nickname
      ORDER BY 
        post_save.created_at DESC`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// render user-post-publish-edit 獲取指定user_id的指定post.id
router.get('/publish/:userId/:postId', async function (req, res, next) {
  const { userId, postId } = req.params
  const sqlSelect = `SELECT 
        post.id, 
        post.title, 
        post.content,
        user.id AS user_id,
        user.nickname,
        GROUP_CONCAT(DISTINCT post_image.pic) AS post_imgs,
        GROUP_CONCAT(DISTINCT post_tag.name) AS tags,
        (SELECT COUNT(*) FROM post_like WHERE post_like.post_id = post.id) AS like_count
      FROM 
        post
      JOIN 
        user ON post.user_id = user.id
      LEFT JOIN
        post_image ON post.id = post_image.post_id
      LEFT JOIN 
        post_like ON post.id = post_like.post_id
      LEFT JOIN
        post_tag_relation ON post.id = post_tag_relation.post_id
      LEFT JOIN
        post_tag ON post_tag_relation.tag_id = post_tag.id
      WHERE
        post.user_id= ${userId} AND post.id = ${postId}
      GROUP BY    
        post.id, user.id, user.img, user.nickname
      ORDER BY 
        post.created_at DESC
       LIMIT 1`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// create comment
router.post(
  '/comment_create',
  upload.array('files'),
  async function (req, res, next) {
    const { userId, postId, content, replyId } = req.body
    const sqlInsert = `INSERT INTO post_comment
      (post_id, user_id, content, parent_id, created_at)
      VALUES (?, ?, ?, ?, NOW())`
    await db.query(sqlInsert, {
      replacements: [postId, userId, content, replyId || null], // 使用 replacements 傳遞參數
      type: db.QueryTypes.INSERT,
    })
    res.json({ status: 'success', message: '留言成功' })
  }
)

// tags search
router.get('/tags', async function (req, res, next) {
  // const sqlSelect = `SELECT name FROM post_tag`
  // const [result] = await db.query(sqlSelect)
  // res.json(result)
  const { tagInput } = req.query
  console.log('tagInput received:', tagInput)
  const sqlSelect = `
  SELECT post_tag.name FROM post_tag
  WHERE name LIKE '%${tagInput}%'`
  const [result] = await db.query(sqlSelect)
  res.json(result)
})

export default router

// update comment

// delete comment
