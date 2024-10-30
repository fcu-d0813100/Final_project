import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

// render post-wall page
router.get('/post_wall', async function (req, res, next) {
  const sqlSelect = `SELECT 
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
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})
// render post-detail 指定id
router.get('/post_wall/:id', async function (req, res, next) {
  const sqlSelect = `
    WITH RECURSIVE CommentHierarchy AS (
      SELECT
          post_comment.id,
          post_comment.post_id,
          post_comment.user_id,
          post_comment.content,
          post_comment.created_at,
          post_comment.parent_id,
          user.nickname AS comment_author_nickname,
          1 AS depth
      FROM
          post_comment
      JOIN
          user ON post_comment.user_id = user.id
      WHERE
          post_comment.post_id = ${req.params.id}
          AND post_comment.parent_id IS NULL

      UNION ALL

      SELECT
          pc.id,
          pc.post_id,
          pc.user_id,
          pc.content,
          pc.created_at,
          pc.parent_id,
          u.nickname AS comment_author_nickname,
          ch.depth + 1 AS depth
      FROM
          post_comment AS pc
      JOIN
          CommentHierarchy AS ch ON pc.parent_id = ch.id
      JOIN
          user AS u ON pc.user_id = u.id
    )

    SELECT
        post.*,
        post_author.id AS post_author_id,
        post_author.nickname AS post_author_nickname,
        GROUP_CONCAT(DISTINCT post_image.pic) AS post_imgs,
        GROUP_CONCAT(DISTINCT post_tag.name) AS tags,
        COUNT(DISTINCT post_like.id) AS like_count,
        COUNT(DISTINCT post_save.id) AS save_count,
        COUNT(DISTINCT CommentHierarchy.id) AS comment_count,
        CommentHierarchy.id AS comment_id,
        CommentHierarchy.content AS comment_content,
        CommentHierarchy.created_at AS comment_created_at,
        CommentHierarchy.comment_author_nickname,
        CommentHierarchy.depth
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
        post.id = ${req.params.id}
    GROUP BY
        post.id,
        post_author.id,
        CommentHierarchy.id
  `
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json({ status: 'success', result })
})

// render user-post-publish 指定id
router.get('/post_publish/:id', async function (req, res, next) {
  const sqlSelect = `SELECT 
        post.id, 
        post.title, 
        user.id AS user_id,
        user.img AS user_img, 
        COUNT(post_like.id) AS like_count,
        (SELECT pic FROM post_image WHERE post_image.post_id = post.id LIMIT 1) AS post_img
      FROM 
        post
      JOIN 
        user ON post.user_id = user.id
      LEFT JOIN 
        post_like ON post.id = post_like.post_id
      WHERE 
      user.id = ${req.params.id}
      GROUP BY    
        post.id, user.id, user.img, user.nickname
      ORDER BY 
        post.created_at DESC
      LIMIT 10`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// 獲取 特定ID user-post-save
router.get('/post_save/:id', async function (req, res, next) {
  const sqlSelect = `SELECT 
        post.id, 
        post.title, 
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
        post.id IN (SELECT post_id FROM post_save WHERE user_id = ${req.params.id})
      GROUP BY    
        post.id, user.id, user.img, user.nickname
      ORDER BY 
        post_save.created_at DESC`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// render user-post-publish-edit 獲取指定user_id的指定post.id
router.get('/post_publish/:user_id/:post_id', async function (req, res, next) {
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
        post.user_id= ${req.params.user_id} AND post.id = ${req.params.post_id}
      GROUP BY    
        post.id, user.id, user.img, user.nickname
      ORDER BY 
        post.created_at DESC
       LIMIT 1`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// create post  put
// update post  put
// delete 特定ID delete

// create comment
// update comment
// delete comment

// search 熱門排序
// search 最新排序
// search 指定關鍵字
export default router
