import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

// 獲取 post-wall 列表
router.get('/', async function (req, res, next) {
  const [data] = await db.query(
    `SELECT 
        post.id, 
        post.title, 
        user.id AS user_id,
        user.nickname, 
        user.img AS user_img, 
        COUNT(post_like.id) AS like_count,
        (SELECT pic FROM post_image WHERE post_image.post_id = post.id LIMIT 1) AS post_img
      FROM 
        post
      JOIN 
        user ON post.user_id = user.id
      LEFT JOIN 
        post_like ON post.id = post_like.post_id
      GROUP BY    
        post.id, user.id, user.img, user.nickname`
  )
  res.json({ status: 'success', data })
})
// 獲取 post-detail 列表

export default router
