import express from 'express'
import db from '#configs/db.js'
import cors from 'cors'

const router = express.Router()
router.use(cors())

router.get('/product-list', async function (req, res, next) {
  const main_category_id = parseInt(req.query.main_category_id, 10)
  console.log('Received main_category_id:', main_category_id) // 打印 main_category_id 確認接收成功

  // 基本 SQL 查詢語句
  let sqlSelect = `
   SELECT DISTINCT
    p.id AS product_id,
    p.product_name,
    p.originalprice,
    p.price,
    p.usages,
    b.name AS brand,
    mc.name AS main_category,
    sc.name AS sub_category,
    c.id AS color_id,
    c.color_name,
    c.color,
    c.mainimage,
    c.stock
FROM 
    product_list p
JOIN 
    brand b ON p.brand_id = b.id
JOIN 
    main_category mc ON p.main_category_id = mc.id
JOIN 
    sub_category sc ON p.sub_category_id = sc.id
JOIN 
    color c ON p.id = c.product_id;
  `

  const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
  res.json(result)
})

// // 動態路由：根據 color_id 查詢商品詳細數據
// router.get('/product-list/:cid', async function (req, res, next) {
//   const colorId = parseInt(req.params.cid, 10);

//   const sqlSelect = `
//     SELECT
//       p.id AS product_id,
//       p.product_name,
//       p.originalprice,
//       p.price,
//       b.name AS brand,
//       mc.mcname AS main_category,
//       sc.name AS sub_category,
//       c.id AS color_id,
//       c.color_name,
//       c.color,
//       c.mainimage,
//       c.stock
//     FROM
//       product_list p
//     JOIN
//       brand b ON p.brand_id = b.id
//     JOIN
//       main_category mc ON p.main_category_id = mc.id
//     JOIN
//       sub_category sc ON p.sub_category_id = sc.id
//     JOIN
//       color c ON p.id = c.product_id
//     WHERE
//       c.id = ${req.params.cid}
//   `;

//   try {
//     const [result] = await db.query(sqlSelect, [colorId]);

//     if (result.length === 0) {
//       return res.status(404).json({ error: '找不到該商品' });
//     }

//     res.json(result[0]);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: '資料查詢錯誤' });
//   }
// });

router.get('/product-list/:cid', async function (req, res) {
  const colorId = parseInt(req.params.cid, 10)

  console.log('Received colorId:', colorId)

  try {
    // 檢查 colorId 是否有效
    if (isNaN(colorId)) {
      return res.status(400).json({ error: '無效的 colorId' })
    }

    // 根據 color 表的主鍵 id 查詢對應的 product_id
    const getProductIdQuery = `SELECT product_id FROM color WHERE id = ${colorId}`
    const [productResult] = await db.query(getProductIdQuery, [colorId])

    if (productResult.length === 0) {
      console.log('No product found with colorId:', colorId)
      return res.status(404).json({ error: '找不到該商品' })
    }

    const productId = productResult[0].product_id
    console.log('Retrieved productId:', productId)

    // 使用查詢到的 product_id，查詢該 product_id 的所有顏色資料
    const sqlSelect = `
      SELECT 
        p.id AS product_id,
        p.product_name,
        p.originalprice,
        p.price,
        p.usages,
        p.description,
        b.name AS brand,
        mc.name AS main_category,
        sc.name AS sub_category,
        c.id AS color_id,
        c.color_name,
        c.color,
        c.mainimage,
        ip.info_image,
        c.stock
      FROM 
        product_list p
      JOIN 
        brand b ON p.brand_id = b.id
      JOIN 
        main_category mc ON p.main_category_id = mc.id
      JOIN 
        sub_category sc ON p.sub_category_id = sc.id
      JOIN 
        color c ON p.id = c.product_id
      JOIN
        info_pic ip ON p.id = ip.product_id
      WHERE 
        p.id = ${productId};
    `

    const [result] = await db.query(sqlSelect, [productId])
    console.log('Query Result:', result)

    if (result.length === 0) {
      return res.status(404).json({ error: '找不到該商品' })
    }

    res.json(result)
  } catch (error) {
    console.error('Database Query Error:', error)
    res.status(500).json({ error: '資料查詢錯誤' })
  }
})

// 動態路由，使用 :main_category_id 作為參數，直接篩選 main_category_id
router.get(
  '/product-list/category/:main_category_id',
  async function (req, res, next) {
    const main_category_id = parseInt(req.params.main_category_id, 10) // 從路由參數中取得 main_category_id
    console.log('Received main_category_id:', main_category_id) // 打印確認接收成功

    // SQL 查詢語句，直接篩選指定的 main_category_id
    const sqlSelect = `
    SELECT 
<<<<<<< HEAD
    p.id AS id,
    p.product_name,
    p.originalprice,
    p.price,
    b.name AS brand,
    mc.name AS main_category,
    sc.name AS sub_category,
    c.id AS color_id,
    c.color_name,
    c.color,
    c.mainimage,
    c.stock
FROM 
    product_list p
JOIN 
    brand b ON p.brand_id = b.id
JOIN 
    main_category mc ON p.main_category_id = mc.id
JOIN 
    sub_category sc ON p.sub_category_id = sc.id
JOIN 
    color c ON p.id = c.product_id
WHERE 
    p.main_category_id = ${req.params.main_category_id}
GROUP BY 
    c.id;

  `

    try {
      // 執行查詢，使用 main_category_id 參數
      const [result] = await db.query(sqlSelect, [main_category_id])

=======
      p.id AS id,
      p.product_name,
      p.originalprice,
      p.price,
      b.name AS brand,
      mc.name AS main_category,
      sc.name AS sub_category,
      c.id AS color_id,
      c.color_name,
      c.color,
      c.mainimage,
      c.stock
    FROM 
      product_list p
    JOIN 
      brand b ON p.brand_id = b.id
    JOIN 
      main_category mc ON p.main_category_id = mc.id
    JOIN 
      sub_category sc ON p.sub_category_id = sc.id
    JOIN 
      color c ON p.id = c.product_id
    WHERE 
      p.main_category_id = ${req.params.main_category_id}
  `

    try {
      // 執行查詢，使用 main_category_id 參數
      const [result] = await db.query(sqlSelect, [main_category_id])

>>>>>>> dev_yun
      console.log('Query result:', result) // 打印查詢結果
      res.json(result)
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: '資料查詢錯誤' })
    }
  }
)

// 動態路由，根據 main_category_id 和 sub_category_id 篩選商品
router.get(
  '/product-list/category/:main_category_id/:sub_category_id',
  async function (req, res, next) {
    const main_category_id = parseInt(req.params.main_category_id, 10) // 從路由參數中取得 main_category_id
    const sub_category_id = parseInt(req.params.sub_category_id, 10) // 從路由參數中取得 sub_category_id
    console.log(
      'Received main_category_id:',
      main_category_id,
      'and sub_category_id:',
      sub_category_id
    ) // 打印確認接收成功

    // SQL 查詢語句，根據 main_category_id 和 sub_category_id 篩選商品
    const sqlSelect = `
    SELECT 
<<<<<<< HEAD
    p.id AS id,
    p.product_name,
    p.originalprice,
    p.price,
    b.name AS brand,
    mc.name AS main_category,
    sc.name AS sub_category,
    c.id AS color_id,
    c.color_name,
    c.color,
    c.mainimage,
    c.stock
FROM 
    product_list p
JOIN 
    brand b ON p.brand_id = b.id
JOIN 
    main_category mc ON p.main_category_id = mc.id
JOIN 
    sub_category sc ON p.sub_category_id = sc.id
JOIN 
    color c ON p.id = c.product_id
WHERE 
    p.main_category_id = ${req.params.main_category_id} 
    AND p.sub_category_id = ${req.params.sub_category_id}
GROUP BY 
    c.id;

  `

    try {
      // 執行查詢，使用 main_category_id 和 sub_category_id 作為參數
      const [result] = await db.query(sqlSelect, [
        main_category_id,
        sub_category_id,
      ])

=======
      p.id AS id,
      p.product_name,
      p.originalprice,
      p.price,
      b.name AS brand,
      mc.name AS main_category,
      sc.name AS sub_category,
      c.id AS color_id,
      c.color_name,
      c.color,
      c.mainimage,
      c.stock
    FROM 
      product_list p
    JOIN 
      brand b ON p.brand_id = b.id
    JOIN 
      main_category mc ON p.main_category_id = mc.id
    JOIN 
      sub_category sc ON p.sub_category_id = sc.id
    JOIN 
      color c ON p.id = c.product_id
    WHERE 
      p.main_category_id = ${req.params.main_category_id} AND p.sub_category_id = ${req.params.sub_category_id}
  `

    try {
      // 執行查詢，使用 main_category_id 和 sub_category_id 作為參數
      const [result] = await db.query(sqlSelect, [
        main_category_id,
        sub_category_id,
      ])

>>>>>>> dev_yun
      console.log('Query result:', result) // 打印查詢結果
      res.json(result)
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: '資料查詢錯誤' })
    }
  }
)

export default router
