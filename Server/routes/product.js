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

// 新品上市篩選路由
router.get('/product-list/new-arrivals', async function (req, res, next) {
  console.log('Fetching New Arrivals') // 確認請求被觸發

  // SQL 查詢語句，從 product_new 表篩選新品上市產品
  const sqlSelect = `
    SELECT 
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
      product_new pn
    JOIN 
      color c ON pn.color_id = c.id
    JOIN 
      product_list p ON c.product_id = p.id
    JOIN 
      brand b ON p.brand_id = b.id
    JOIN 
      main_category mc ON p.main_category_id = mc.id
    JOIN 
      sub_category sc ON p.sub_category_id = sc.id;
  `

  try {
    const [result] = await db.query(sqlSelect)
    console.log('Query Result:', result) // 打印查詢結果
    res.json(result)
  } catch (e) {
    console.error('Database Query Error:', e)
    res.status(500).json({ error: '資料查詢錯誤' })
  }
})


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

      console.log('Query result:', result) // 打印查詢結果
      res.json(result)
    } catch (e) {
      console.log(e)
      res.status(500).json({ error: '資料查詢錯誤' })
    }
  }
)

// NARS 品牌優惠商品路由
router.get('/product-list/discount/nars', async function (req, res) {
  console.log('Fetching NARS discount products') // 確認請求被觸發

  const sqlSelect = `
    SELECT 
      p.id AS product_id,
      p.product_name,
      p.originalprice,
      (p.price * 0.85) AS discount_price, 
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
      color c ON p.id = c.product_id
    WHERE 
      b.name = 'NARS'; 
  `

  try {
    const [result] = await db.query(sqlSelect)
    console.log('Query Result:', result) // 打印查詢結果
    res.json(result)
  } catch (e) {
    console.error('Database Query Error:', e)
    res.status(500).json({ error: '資料查詢錯誤' })
  }
})

// 價格篩選路由
router.get('/product-list/price-range/:range', async function (req, res, next) {
  // 提取範圍並分隔 minPrice 和 maxPrice
  const range = req.params.range;
  const [minPrice, maxPrice] = range.split('-').map((price, index) => {
    // 檢查當 maxPrice 接收不到或為空時，將其默認設置為 9999999
    return index === 1 && price === '' ? 9999999 : parseFloat(price);
  });
  
  
  console.log('Received price range:', minPrice, maxPrice); // 打印確認接收成功

  // SQL 查詢語句，根據價格範圍篩選商品
  const sqlSelect = `
    SELECT 
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
      color c ON p.id = c.product_id
    WHERE 
      p.price >= ${minPrice} AND p.price <= ${maxPrice}
    GROUP BY 
      c.id;
  `;

  try {
    const [result] = await db.query(sqlSelect, [minPrice || 0, maxPrice || 9999999]);
    console.log('Query Result:', result); // 打印查詢結果
    res.json(result);
  } catch (e) {
    console.error('Database Query Error:', e);
    res.status(500).json({ error: '資料查詢錯誤' });
  }
});

// 品牌篩選路由
router.get('/product-list/brand/:brandName', async function (req, res) {
  const brandName = req.params.brandName;

  console.log('Received brandName:', brandName); // 打印確認接收成功

  // SQL 查詢語句，根據品牌篩選商品
  const sqlSelect = `
    SELECT 
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
      color c ON p.id = c.product_id
    WHERE 
      b.name = '${brandName}'
    GROUP BY 
      c.id;
  `;

  try {
    const [result] = await db.query(sqlSelect, [brandName]);
    console.log('Query Result:', result); // 打印查詢結果
    res.json(result);
  } catch (e) {
    console.error('Database Query Error:', e);
    res.status(500).json({ error: '資料查詢錯誤' });
  }
});

// 關鍵字搜尋動態路由
router.get('/product-list/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword; // 從路由參數中取得 keyword

  console.log('Received keyword:', keyword); // 打印確認接收成功

  // SQL 查詢語句，根據關鍵字篩選商品
  const sqlSelect = `
    SELECT 
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
      color c ON p.id = c.product_id
    WHERE 
      p.product_name LIKE  '%${keyword}%' OR 
      p.description LIKE '%{keyword}%' OR 
      b.name LIKE '%${keyword}%' OR 
      mc.name LIKE '%${keyword}%' OR 
      sc.name LIKE '%${keyword}%'
    GROUP BY 
      c.id;
  `;

  try {
    // 使用 '%' + keyword + '%' 來進行模糊查詢
    const [result] = await db.query(sqlSelect, Array(5).fill(`%${keyword}%`));
    console.log('Query Result:', result); // 打印查詢結果
    res.json(result);
  } catch (e) {
    console.error('Database Query Error:', e);
    res.status(500).json({ error: '資料查詢錯誤' });
  }
});


export default router
