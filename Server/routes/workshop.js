// import express from 'express'
// const router = express.Router()
// import db from '#configs/db.js'

// router.get('/workshop', async function (req, res, next) {
//   const sqlSelect = `SELECT
//     workshop.id,
//     workshop.name,
//     workshop.price,
//     teachers.id AS teacher_id,
//     teachers.name AS teacher_name,
//     workshop.isUpload
//     workshop.valid
//  FROM
//     workshop
//  JOIN
//     teachers ON  workshop.teacher_id = teachers.id `

//   const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
//   res.json(result)
// })
