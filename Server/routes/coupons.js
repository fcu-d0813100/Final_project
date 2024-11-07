import express from 'express';
import db from '#configs/db.js'; // 確保 db 對象正確導入並能使用
const router = express.Router();


/* GET coupons for a specific admin. */
router.get('/', async (req, res) => {
  try {
    // 定义 SQL 查询
    const sqlSelect = `
            SELECT coupon_list.*
            FROM coupon_list
            WHERE coupon_list.valid = 1
            ORDER BY coupon_list.end_date ASC;`;
    // 執行查詢
    const [result] = await db.query(sqlSelect);

    // 检查结果
    if (result.length === 0) {
      return res.status(404).json({ message: 'No coupons found for this admin.' });
    }
    console.log('Query result:', result);
    // 返回结果
    res.json(result);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Error fetching coupons. Please try again later.' });
  }
});

/* GET coupons for a specific admin. */
router.get('/:couponId', async (req, res) => {
  const couponId = req.params.couponId; // 提取 userId
  console.log('Coupon ID:', couponId); // 日志检查 userId
  try {
    // 定义 SQL 查询
    const sqlSelect = `
          SELECT coupon_list.*
          FROM coupon_list
          WHERE coupon_list.id = ${couponId};`;
    // 執行查詢
    const [result] = await db.query(sqlSelect);

    // 检查结果
    if (result.length === 0) {
      return res.status(404).json({ message: 'No coupons found for this admin.' });
    }
    console.log('Query result:', result);
    // 返回结果
    res.json(result);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Error fetching coupons. Please try again later.' });
  }
});


/* POST create a new coupon */
router.post('/create/content', async (req, res) => {

  const newCoupon = req.body;
  console.log('收到的優惠券數據:', newCoupon);

  // 確保優惠碼存在
  if (!newCoupon.code) {
    return res.status(400).json({ status: 'error', message: '優惠碼是必填的。' });
  }

  const [rows] = await db.query(
    `SELECT * FROM coupon_list WHERE code = '${newCoupon.code}'`,
    [newCoupon.code]
  )
  console.log('優惠碼:', newCoupon.code);  // 檢查 coupon.code 是否存在

  if (rows.length > 0) {
    return res.status(400).json({ status: 'error', message: '優惠碼已存在。' });
  }

  // 插入新的優惠券數據到資料庫
  const [insertResult] = await db.query(
    `INSERT INTO coupon_list 
        (type_id, brand_id, code, name, discount_value, minimum_amount, start_date, end_date)
      VALUES (
      ${newCoupon.type_id}, 
      '${newCoupon.brand_id}', 
      '${newCoupon.code}', 
      '${newCoupon.name}', 
      ${newCoupon.discount_value}, 
      ${newCoupon.minimum_amount}, 
      '${newCoupon.start_date}', 
      '${newCoupon.end_date}'
      )`
  );

  console.log('優惠券插入成功:', insertResult);

  if (insertResult) {
    return res.json({ status: 'success', data: null })
  } else {
    return res.json({ status: 'error', message: '新增到資料庫失敗' })
  }
})

// 編輯修改
router.put("/:couponId", async (req, res, next) => {
  const { couponId } = req.params; // 从 URL 参数获取 couponId
  const updateData = req.body; // 从请求体中获取要更新的数据

  try {
    // 构造 SQL 更新语句
    const { code, name, discount_value, minimum_amount, start_date, end_date } = updateData;

    // 使用 db.query 执行更新操作
    const [rows] = await db.query(
      `UPDATE coupon_list SET 
        code = ?, 
        name = ?, 
        discount_value = ?, 
        minimum_amount = ?, 
        start_date = ?, 
        end_date = ? 
      WHERE id = ?`,
      [code, name, discount_value, minimum_amount, start_date, end_date, couponId]
    );

    // 检查是否有行被更新
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: '未找到優惠券' });
    }

    // 返回成功消息
    res.status(200).json({ status: 'success', message: '優惠券更新成功' });

  } catch (err) {
    // 捕获错误并返回
    console.error('更新優惠券失败:', err);
    res.status(500).json({ message: '更新優惠券时发生错误', error: err.message });
  }
});


export default router;



