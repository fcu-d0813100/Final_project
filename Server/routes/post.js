import express from 'express'
const router = express.Router()
import db from '#configs/db.js'
import multer from 'multer'
// import { rest } from 'lodash'
// import { ne } from '@faker-js/faker'

const upload = multer()

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
/* RECURSIVE :第1次查詢的結果賦值給 CommentHierarchy */
/* 第1次基礎查詢:查詢根評論->沒有parent_id的comment.id */
/* 第2次遞迴查詢:查詢子評論->查找根評論是否有子評論 */
/* 重複遞迴查詢:以最新的CommentHierarchy 更新ch.comment_id，找出新加入的子評論 */
/* ch:表示CommentHierarchy父評論  pc:表示post_comment子評論*/
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
         (SELECT COUNT(*) FROM CommentHierarchy) AS comment_count,
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
        post.id = ${req.params.postId}
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

// render user-post-publish 指定id count是錯的
router.get('/post_publish/:userId', async function (req, res, next) {
  const sqlSelect = `SELECT 
        post.id, 
        post.title, 
        post.content,
        post.created_at,
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
      user.id = ${req.params.userId}
      GROUP BY    
        post.id, user.id, user.img, user.nickname
      ORDER BY 
        post.created_at DESC
      LIMIT 10`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// 獲取 特定ID user-post-save
router.get('/post_save/:userId', async function (req, res, next) {
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
        post.id IN (SELECT post_id FROM post_save WHERE user_id = ${req.params.userId})
      GROUP BY    
        post.id, user.id, user.img, user.nickname
      ORDER BY 
        post_save.created_at DESC`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// render user-post-publish-edit 獲取指定user_id的指定post.id
router.get('/post_publish/:userId/:postId', async function (req, res, next) {
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
        post.user_id= ${req.params.userId} AND post.id = ${req.params.postId}
      GROUP BY    
        post.id, user.id, user.img, user.nickname
      ORDER BY 
        post.created_at DESC
       LIMIT 1`
  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// create post  put
router.put('/post_create', async function (req, res, next) {
  const sqlInert = ``
  const [result] = await db.query(sqlInert).catch((e) => console.log(e))
  res.json(result)
})
// update post  put
// delete 特定ID delete

// create comment
router.put('/post_create', async function (req, res, next) {
  const sqlInert = ``
  const [result] = await db.query(sqlInert).catch((e) => console.log(e))
  res.json(result)
})
// update comment
router.post('/', async function (req, res, next) {})
// delete comment

// like post
// save post
// like comment

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
// search 熱門排序
// search 最新排序
// search 指定關鍵字
export default router
