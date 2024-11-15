import express from 'express'
import db from '#configs/db.js'
import cors from 'cors'
import multer from 'multer'
import path from 'path';
import { fileURLToPath } from 'url'

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// router.use(cors())

// 配置文件上傳
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload/reviews/images'); // 確保這個目錄存在
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage }).array('mediaFiles', 5); // 最多允許上傳5個文件

// 文件上傳路由
router.post('/upload/reviews/images', upload, (req, res) => {
  try {
    const files = req.files.map(file => ({
      fileName: file.filename,
      filePath: `/upload/reviews/images/${file.filename}`,
    }));
    res.status(200).json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: '文件上傳失敗', error });
  }
});


router.use('/upload', express.static(path.join(__dirname, 'public/upload')));

// 創建商品評論路由 - POST
router.post('/create-review/:productId/:colorId', upload, async function (req, res, next) {
  try {
    const { productId, colorId } = req.params;
    const { product_id, color_id, comment, rating } = req.body; // 保留其他評論的內容
     const uploadedFiles = req.files['mediaFiles'] ? req.files['mediaFiles'].map((file) => file.filename) : [];
    console.log('Uploaded files:', req.files);

    console.log("req.body:", req.body); // 檢查是否接收到表單數據
    console.log("req.files:", req.files); // 檢查是否接收到文件數據
    console.log("product_id:", product_id);
    console.log("color_id:", color_id);
    console.log("comment:", comment);
    console.log("rating:", rating);

    // 插入評論到 order_item 表
    const sqlInsertReview = `
      INSERT INTO order_item (product_id, color_id, comment, rating, review_date, review_likes)
      VALUES (${productId}, ${colorId}, '${comment}', ${rating}, NOW(), 0)
    `;
    const [reviewResult] = await db.query(sqlInsertReview);
    console.log('Review Result:', reviewResult); // 確認 reviewResult 的結構
    const orderItemId = reviewResult.insertId;

   // 構建 review_file 插入語句
   if (uploadedFiles.length > 0) {
    const sqlInsertMediaFiles = `
      INSERT INTO review_file (order_item_id, product_id, file_name, file_type)
      VALUES ${uploadedFiles
        .map((file) => `(${orderItemId}, ${productId}, '${file}', '${path.extname(file)}')`)
        .join(', ')}
    `;
    console.log("SQL for inserting media files:", sqlInsertMediaFiles); // 調試用

    const [mediaInsertResult] = await db.query(sqlInsertMediaFiles);
    console.log("Media Insert Result:", mediaInsertResult); // 確認是否成功插入
  }

    res.json({
      status: 'success',
      message: `ID:${orderItemId} 評論和文件插入成功`,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      status: 'error',
      message: '評論創建失敗',
    });
  }
});


// // 商品列表包含商品篩選
// router.get('/product-list', async function (req, res) {
//   const main_category_id = parseInt(req.query.main_category_id, 10) || null;
//   const sub_category_id = parseInt(req.query.main_category_id, 10) || null;
//   const minPrice = parseFloat(req.query.minPrice) || 0;
//   const maxPrice = parseFloat(req.query.maxPrice) || 9999999;
//   const brand = req.query.brand || null;
//   const isNewArrivals = req.query.isNewArrivals === 'true';
//   const isDiscounted = req.query.isDiscounted === 'true';
//   const isPopular = req.query.isPopular === 'true';

//   console.log('Received query params:', {
//     main_category_id,
//     sub_category_id,
//     minPrice,
//     maxPrice,
//     brand,
//     isNewArrivals,
//     isDiscounted,
//     isPopular
//   });

//   // 基本 SQL 查詢語句
//   let sqlSelect = `
//     SELECT DISTINCT
//       p.id AS product_id,
//       p.product_name,
//       p.originalprice,
//       ${isDiscounted ? '(p.price * 0.85)' : 'p.price'} AS price,
//       b.name AS brand,
//       mc.name AS main_category,
//       sc.name AS sub_category,
//       c.id AS color_id,
//       c.color_name,
//       c.color,
//       c.mainimage,
//       c.stock,
//       COUNT(pl.color_id) AS likes_count
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
//     LEFT JOIN 
//       product_like pl ON c.id = pl.color_id
//   `;

//   // 動態添加篩選條件
//   if (isNewArrivals) {
//     sqlSelect += ` JOIN product_new pn ON c.id = pn.color_id`;
//   }

//   // 構建 WHERE 條件
//   const conditions = [`p.price >= ${minPrice} AND p.price <= ${maxPrice}`];
  
//   if (main_category_id) {
//     conditions.push(`p.main_category_id = ${main_category_id}`);
//   }
//   if (sub_category_id) {
//     conditions.push(`p.sub_category_id = ${sub_category_id}`);
//   }
//   if (brand) {
//     conditions.push(`b.name = '${brand}'`);
//   }
//   if (isDiscounted) {
//     conditions.push(`b.name = 'NARS'`);
//   }

//   // 將 WHERE 條件連接到查詢語句
//   if (conditions.length > 0) {
//     sqlSelect += ` WHERE ${conditions.join(' AND ')}`;
//   }

//   // 根據是否熱門排序來設置 GROUP BY 和 ORDER BY
//   if (isPopular) {
//     sqlSelect += ` GROUP BY c.id ORDER BY likes_count DESC`;
//   } else {
//     sqlSelect += ` GROUP BY c.id`;
//   }

//   try {
//     const [result] = await db.query(sqlSelect);
//     console.log('Query Result:', result);
//     res.json(result);
//   } catch (error) {
//     console.error('Database Query Error:', error);
//     res.status(500).json({ error: '資料查詢錯誤' });
//   }
// });




// 商品列表包含商品篩選
router.get('/product-list', async function (req, res) {
  const main_category_id = parseInt(req.query.main_category_id, 10) || null;
  const sub_category_id = parseInt(req.query.sub_category_id, 10) || null;
  const minPrice = parseFloat(req.query.minPrice) || 0;
  const maxPrice = parseFloat(req.query.maxPrice) || 9999999;
  const brand = req.query.brand || null;
  const isNewArrivals = req.query.isNewArrivals === 'true';
  const isDiscounted = req.query.isDiscounted === 'true';
  const isPopular = req.query.isPopular === 'true';


  console.log('Received query params:', {
    main_category_id,
    sub_category_id,
    minPrice,
    maxPrice,
    brand,
    isNewArrivals,
    isDiscounted,
    isPopular
  });

  // 基本 SQL 查詢語句
  let sqlSelect = `
    SELECT DISTINCT
      p.id AS product_id,
      p.product_name,
      p.originalprice,
      ${isDiscounted ? '(p.price * 0.85)' : 'p.price'} AS price,
      b.name AS brand,
      mc.name AS main_category,
      sc.name AS sub_category,
      c.id AS color_id,
      c.color_name,
      c.color,
      c.mainimage,
      c.stock,
      COUNT(pl.color_id) AS likes_count
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
    LEFT JOIN 
      product_like pl ON c.id = pl.color_id
  `;

  // 動態添加篩選條件第2版
  if (isNewArrivals) {
    sqlSelect += ` JOIN product_new pn ON c.id = pn.color_id`;
  }

  // 構建 WHERE 條件
  const conditions = [`p.price >= ${minPrice} AND p.price <= ${maxPrice}`];
  
  if (main_category_id) {
    conditions.push(`p.main_category_id = ${main_category_id}`);
  }
  if (sub_category_id) {
    conditions.push(`p.sub_category_id = ${sub_category_id}`);
  }
  if (brand) {
    conditions.push(`b.name = '${brand}'`);
  }
  if (isDiscounted) {
    conditions.push(`b.name = 'NARS'`);
  }
  // 將 WHERE 條件連接到查詢語句
  if (conditions.length > 0) {
    sqlSelect += ` WHERE ${conditions.join(' AND ')}`;
  }
  // 動態添加篩選條件第2版


  // 添加 GROUP BY 和 ORDER BY 用于人氣排序
  sqlSelect += ` GROUP BY c.id`;
  if (isPopular) {
    sqlSelect += ` ORDER BY likes_count DESC`;
  }

  try {
    const [result] = await db.query(sqlSelect);
    console.log('Query Result:', result);
    res.json(result);
  } catch (error) {
    console.error('Database Query Error:', error);
    res.status(500).json({ error: '資料查詢錯誤' });
  }
});

// // 新品上市篩選路由
// router.get('/product-list/new-arrivals', async function (req, res, next) {
//   console.log('Fetching New Arrivals') // 確認請求被觸發

//   // SQL 查詢語句，從 product_new 表篩選新品上市產品
//   const sqlSelect = `
//     SELECT DISTINCT
//       p.id AS product_id,
//       p.product_name,
//       p.originalprice,
//       p.price,
//       p.usages,
//       b.name AS brand,
//       mc.name AS main_category,
//       sc.name AS sub_category,
//       c.id AS color_id,
//       c.color_name,
//       c.color,
//       c.mainimage,
//       c.stock
//     FROM 
//       product_new pn
//     JOIN 
//       color c ON pn.color_id = c.id
//     JOIN 
//       product_list p ON c.product_id = p.id
//     JOIN 
//       brand b ON p.brand_id = b.id
//     JOIN 
//       main_category mc ON p.main_category_id = mc.id
//     JOIN 
//       sub_category sc ON p.sub_category_id = sc.id;
//   `

//   try {
//     const [result] = await db.query(sqlSelect)
//     console.log('Query Result:', result) // 打印查詢結果
//     res.json(result)
//   } catch (e) {
//     console.error('Database Query Error:', e)
//     res.status(500).json({ error: '資料查詢錯誤' })
//   }
// })

// 詳細頁路由
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

// // 單一篩選版本------------------------------------------------------------------------------------------------------
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

// 庫存更新路由
router.post('/product-list/update-stock/:color_id', async function (req, res) {
  const color_id = parseInt(req.params.color_id, 10); // 從路由參數中獲取 color_id
  const { quantity } = req.body;

  console.log('Received color_id:', color_id, 'Quantity to decrease:', quantity);

  try {
    // 驗證 color_id 和 quantity 是否有效
    if (!color_id || isNaN(color_id) || !quantity || quantity < 1) {
      return res.status(400).json({ error: '無效的 color_id 或 quantity' });
    }

    // 更新庫存數量，將 color 表中指定 color_id 的庫存減少指定數量
    const updateStockQuery = `
      UPDATE color 
      SET stock = stock - ${quantity}
      WHERE id = ${color_id} AND stock >= ${quantity};
    `;

    const [result] = await db.query(updateStockQuery); 

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: '庫存不足或 color_id 無效' });
    }

    console.log('Stock updated successfully for color_id:', color_id);
    res.json({ message: '庫存更新成功' });
  } catch (error) {
    console.error('Database Query Error:', error);
    res.status(500).json({ error: '資料庫更新錯誤' });
  }
});
// 單一篩選版本-------------------------------------------------------------------------------------------


// 評論路由
router.get('/product-list/reviews/:product_id', async (req, res) => {
  const { product_id, color_id } = req.params;

  try {
    // 查詢評論數據及媒體文件
    const sqlSelect = `
      SELECT 
        oi.id AS order_item_id,
        oi.product_id,
        oi.color_id,
        oi.rating,
        oi.review_date,
        oi.review_likes,
        oi.comment,
        rf.file_name,
        rf.file_type
      FROM 
        order_item oi
      LEFT JOIN 
        review_file rf ON oi.id = rf.order_item_id
      WHERE 
        oi.product_id = ${product_id} 
      ORDER BY 
        oi.review_date DESC;
    `;

    const [reviews] = await db.query(sqlSelect, [product_id, color_id]);

    // 調試輸出，檢查查詢返回的數據
    console.log('Fetched reviews from database:', reviews);

    // 整理數據，將每個評論的媒體文件分組
    const reviewsWithMedia = [];
    const reviewMap = {};

    reviews.forEach((review) => {
      const {
        order_item_id,
        color_id,
        rating,
        review_date,
        review_likes,
        comment,
        file_name,
        file_type,
      } = review;

      // 如果這個評論還沒被加入到 map 中，初始化它
      if (!reviewMap[order_item_id]) {
        reviewMap[order_item_id] = {
          order_item_id,
          color_id,
          rating,
          review_date,
          review_likes,
          comment,
          media: [],
        };
        reviewsWithMedia.push(reviewMap[order_item_id]);
      }

      // 如果有圖片或影片文件，將其添加到媒體列表，並生成完整的 URL
      if (file_name) {
        reviewMap[order_item_id].media.push({
          file_name,
          file_type,
          url: `http://localhost:3005/upload/reviews/${file_type === '.mp4' ? 'videos' : 'images'}/${file_name}`,
        });
      }
    });

    // 調試輸出檢查 reviewsWithMedia 的內容
    console.log('reviewsWithMedia:', reviewsWithMedia);
    res.json(reviewsWithMedia);
  } catch (error) {
    console.error('Error fetching reviews and media:', error);
    res.status(500).json({ error: '評論數據查詢錯誤' });
  }
});

// 收藏商品
router.post('/favorite/:color_id/:user_id', async (req, res) => {
  const { color_id, user_id } = req.params;

  if (!color_id || !user_id) {
    return res.status(400).json({ message: '缺少必要的參數' });
  }

  try {
    // 檢查是否已經收藏過此商品
    const [existingFavorite] = await db.query(
      `SELECT * FROM product_like WHERE color_id = ${req.params.color_id} AND user_id = ${req.params.user_id}`,
      [color_id, user_id]
    );

    if (existingFavorite.length > 0) {
      return res.status(409).json({ message: '商品已收藏' });
    }

    // 插入收藏紀錄
    await db.query(
    `INSERT INTO product_like (color_id, user_id, created_at) VALUES (${req.params.color_id}, ${req.params.user_id}, NOW())`,
      [color_id, user_id]
    );

    res.status(201).json({ message: '已收藏商品' });
  } catch (error) {
    console.error('收藏商品錯誤:', error);
    res.status(500).json({ message: '收藏商品失敗' });
  }
});

// 取消收藏
router.delete('/favorite/:color_id/:user_id', async (req, res) => {
  const { color_id, user_id } = req.params;

  if (!color_id || !user_id) {
    return res.status(400).json({ message: '缺少必要的參數' });
  }

  try {
    // 刪除收藏紀錄
    const [result] = await db.query(
      `DELETE FROM product_like WHERE color_id = ${req.params.color_id} AND user_id =  ${req.params.user_id}`,
      [color_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '收藏紀錄不存在' });
    }

    res.status(200).json({ message: '已取消收藏' });
  } catch (error) {
    console.error('取消收藏商品錯誤:', error);
    res.status(500).json({ message: '取消收藏失敗' });
  }
});


// 查詢指定使用者的收藏清單
router.get('/favorite/search/:user_id', async (req, res) => {
  const { user_id } = req.params;

  if (!user_id) {
    return res.status(400).json({ message: '缺少必要的參數 user_id' });
  }

  try {
    // 查詢指定使用者的收藏商品
    const [favorites] = await db.query(
      `SELECT pl.*, c.*, p.*
       FROM product_like pl
       JOIN color c ON pl.color_id = c.id
       JOIN product_list p ON c.product_id = p.id
       WHERE pl.user_id = ${req.params.user_id}`,
      [user_id]
    );

    res.status(200).json(favorites);
  } catch (error) {
    console.error('查詢收藏清單錯誤:', error);
    res.status(500).json({ message: '查詢收藏清單失敗' });
  }
});

// 動態添加篩選條件
  // if (isNewArrivals) {
  //   sqlSelect += ` JOIN product_new pn ON c.id = pn.color_id`;
  // }

  // sqlSelect += ` WHERE p.price >= ${minPrice} AND p.price <= ${maxPrice}`;

  // if (main_category_id) {
  //   sqlSelect += ` AND p.main_category_id = ${main_category_id}`;
  // }
  // if (sub_category_id) {
  //   sqlSelect += ` AND p.sub_category_id = ${sub_category_id}`;
  // }
  // if (brand) {
  //   sqlSelect += ` AND b.name = '${brand}'`;
  // }
  // if (isDiscounted) {
  //   sqlSelect += ` AND b.name = 'NARS'`;
  // }

export default router
