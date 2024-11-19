import express from 'express';
import db from '#configs/db.js'; // 確保 db 物件正確導入並能使用
const router = express.Router();

/* 取得所有有效的優惠券 */
router.get('/', async (req, res) => {
  try {
    // 定義 SQL 查詢
    const sqlSelect = `
      SELECT coupon_list.*
      FROM coupon_list
      WHERE coupon_list.valid = 1
      ORDER BY coupon_list.end_date ASC;
    `;
    // 執行查詢
    const [result] = await db.query(sqlSelect);

    // 檢查查詢結果
    if (result.length === 0) {
      return res.status(404).json({ message: '未找到有效的優惠券。' });
    }

    console.log('查詢結果:', result);
    // 返回結果
    res.json(result);
  } catch (error) {
    console.error('查詢資料庫錯誤:', error);
    res.status(500).json({ message: '獲取優惠券時發生錯誤，請稍後再試。' });
  }
});

/* 取得特定優惠券 */
router.get('/:couponId', async (req, res) => {
  const couponId = req.params.couponId; // 提取優惠券ID
  console.log('優惠券 ID:', couponId); // 日誌檢查優惠券ID

  try {
    // 定義 SQL 查詢
    const sqlSelect = `
      SELECT coupon_list.*
      FROM coupon_list
      WHERE coupon_list.id = ${couponId};
    `;
    // 執行查詢
    const [result] = await db.query(sqlSelect);

    // 檢查查詢結果
    if (result.length === 0) {
      return res.status(404).json({ message: '未找到該優惠券。' });
    }

    console.log('查詢結果:', result);
    // 返回結果
    res.json(result);
  } catch (error) {
    console.error('查詢資料庫錯誤:', error);
    res.status(500).json({ message: '獲取優惠券時發生錯誤，請稍後再試。' });
  }
});

/* 創建新優惠券 */
router.post('/create/content', async (req, res) => {

  const newCoupon = req.body;
  console.log('收到的優惠券資料:', newCoupon);

  // 確保優惠碼存在
  if (!newCoupon.code) {
    return res.status(400).json({ status: 'error', message: '優惠碼是必填的。' });
  }

  // 查詢優惠碼是否已存在
  const [rows] = await db.query(
    `SELECT * FROM coupon_list WHERE code = '${newCoupon.code}'`,
    [newCoupon.code]
  );
  console.log('優惠碼:', newCoupon.code);  // 檢查 coupon.code 是否存在

  if (rows.length > 0) {
    return res.status(400).json({ status: 'error', message: '優惠碼已存在。' });
  }

  // 插入新的優惠券資料到資料庫
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
    return res.json({ status: 'success', data: null });
  } else {
    return res.json({ status: 'error', message: '新增到資料庫失敗' });
  }
});

/* 編輯或更新優惠券資料 */
router.put("/:couponId", async (req, res, next) => {
  const { couponId } = req.params; // 從 URL 參數中獲取 couponId
  const updateData = req.body; // 從請求體中獲取要更新的資料

  console.log('收到的優惠券資料:', updateData);

  // 從請求體中解構出優惠券資料
  const { brand_id, code, name, discount_value, minimum_amount, start_date, end_date, valid } = updateData;

  try {
    // 如果 valid == 0，表示優惠券無效，將其標記為無效
    if (valid === 0) {
      const [rows] = await db.query(
        `UPDATE coupon_list SET valid = 0 WHERE id = ${couponId}`
      );

      if (rows.affectedRows === 0) {
        return res.status(404).json({ message: '未找到該優惠券，無法標記為無效' });
      }

      return res.status(200).json({ status: 'success', message: '優惠券已標記為無效' });
    }

    // 否則執行一般的更新操作
    const [rows] = await db.query(
      `UPDATE coupon_list SET
        brand_id = '${brand_id}', 
        code = '${code}', 
        name = '${name}', 
        discount_value = ${discount_value}, 
        minimum_amount = ${minimum_amount}, 
        start_date = '${start_date}', 
        end_date = '${end_date}' ,
        valid = ${valid}
      WHERE id = ${couponId}`
    );

    // 檢查是否有行被更新
    if (rows.affectedRows === 0) {
      return res.status(404).json({ message: '未找到該優惠券' });
    }

    // 返回成功消息
    res.status(200).json({ status: 'success', message: '優惠券更新成功' });

  } catch (err) {
    // 捕獲錯誤並返回
    console.error('更新優惠券失敗:', err);
    res.status(500).json({ message: '更新優惠券時發生錯誤', error: err.message });
  }
});

export default router;
