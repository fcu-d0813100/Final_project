import express from 'express';
const router = express.Router();
import db from '#configs/db.js';

// 獲取特定用戶的優惠券
// 獲取特定用戶的優惠券
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;  // 獲取 URL 參數中的 userId
    const limit = parseInt(req.query.limit) || 6;  // 每頁顯示的優惠券數量，保證為整數
    const page = parseInt(req.query.page) || 1;    // 當前頁面，保證為整數

    console.log('用戶 ID:', userId);  // 日誌檢查 userId
    console.log('Limit:', limit, 'Page:', page);  // 日誌檢查每頁數量和當前頁

    try {
        // 計算 OFFSET
        const offset = (page - 1) * limit;

        console.log('Offset:', offset);  // 確認 OFFSET 的計算

        // 當前日期，格式為 YYYY-MM-DD
        const currentDate = new Date().toISOString().split('T')[0]; // 取出 YYYY-MM-DD 部分

        // 更新 SQL 查詢，加入分頁功能以及 end_date > currentDate 篩選條件
        const sqlSelect = `
            SELECT coupon_relation.*,
                   coupon_list.name,
                   coupon_list.discount_value,
                   coupon_list.minimum_amount,
                   coupon_list.start_date,
                   coupon_list.end_date,
                   coupon_list.type_id,
                   coupon_list.brand_id
            FROM coupon_relation 
            JOIN coupon_list ON coupon_relation.coupon_id = coupon_list.id
            WHERE coupon_relation.user_id = ${userId}
              AND coupon_list.end_date > '${currentDate}'  -- 篩選 end_date 大於當前日期的優惠券
              AND coupon_relation.order_id IS NULL
            ORDER BY coupon_list.end_date ASC
            LIMIT ${limit} OFFSET ${offset}`;  // 使用 LIMIT 和 OFFSET 來分頁

        // 獲取總數
        const sqlCount = `
            SELECT COUNT(*) as totalCount
            FROM coupon_relation 
            JOIN coupon_list ON coupon_relation.coupon_id = coupon_list.id
            WHERE coupon_relation.user_id = ${userId}
              AND coupon_list.end_date > '${currentDate}'`;  // 獲取符合條件的總數

        // 執行 SQL 查詢
        const [coupons] = await db.query(sqlSelect);
        const [[{ totalCount }]] = await db.query(sqlCount);  // 獲取總數

        console.log('Total Coupons:', totalCount);  // 確認總數計算

        if (coupons.length === 0) {
            return res.status(404).json({ success: false, message: '此用戶尚未擁有任何有效的優惠券。' });
        }

        res.status(200).json({
            success: true,
            data: coupons,
            totalCount: totalCount,  // 返回總數
        });

    } catch (error) {
        console.error('資料庫查詢錯誤:', error);
        res.status(500).json({ message: '獲取優惠券時發生錯誤，請稍後再試。' });
    }
});




// 檢查用戶是否已領取特定優惠券
router.get('/', async (req, res) => {
    const { userId, couponId } = req.query;

    if (!userId || !couponId) {
        return res.status(400).json({ error: '缺少必要的參數: userId 或 couponId' });
    }

    console.log('收到請求:', { userId, couponId });  // 日誌請求參數

    try {
        const result = await db.query(
            `SELECT * FROM coupon_relation WHERE user_id = ${userId} AND coupon_id = ${couponId}`
        );
        console.log(result);

        if (result[0].length > 0) {
            return res.json({ hasClaimed: true });
        } else {
            return res.json({ hasClaimed: false });
        }
    } catch (err) {
        console.error('資料庫錯誤:', err);  // 打印資料庫錯誤
        return res.status(500).json({ error: '資料庫查詢失敗', details: err.message });
    }
});

// 用戶領取優惠券
router.post('/', async (req, res) => {
    const { userId, coupon_id } = req.body;
    console.log('收到 userId:', userId);  // 打印 userId
    console.log('收到 coupon_id:', coupon_id);  // 打印 couponId
    
    if (!userId || !coupon_id) {
        return res.status(400).json({ success: false, error: '缺少必要的參數' });
    }

    try {
        // 查詢用戶是否已經領取過此優惠券
        const result = await db.query(`SELECT * FROM coupon_relation WHERE user_id = ${userId} AND coupon_id = ${coupon_id}`);

        console.log(result);

        if (result[0].length > 0) {
            return res.status(400).json({ success: false, error: '您已經領取過此優惠券。' });
        }

        // 添加優惠券領取記錄
        await db.query(`INSERT INTO coupon_relation (user_id, coupon_id) VALUES (${userId}, ${coupon_id})`);

        return res.json({ success: true, message: '優惠券領取成功！' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: '領取優惠券時發生錯誤' });
    }
});

// 獲取用戶的優惠券歷史記錄
router.get('/history/:userId', async (req, res) => {
    const userId = req.params.userId;
    try {
        const sqlSelect = `
            SELECT coupon_relation.*,
                   coupon_list.name,
                   coupon_list.discount_value,
                   coupon_list.minimum_amount,
                   coupon_list.end_date,
                   coupon_list.brand_id,
                   order_list.id as order_id
            FROM coupon_relation 
            JOIN coupon_list ON coupon_relation.coupon_id = coupon_list.id
            LEFT JOIN order_list ON order_list.coupon_id = coupon_list.id
            JOIN user ON coupon_relation.user_id = user.id  
            WHERE coupon_relation.user_id = ${userId}
            ORDER BY coupon_relation.id DESC`;
        
        const [result] = await db.query(sqlSelect, [userId]);
        console.log(result);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: '此用戶沒有優惠券歷史紀錄。' });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('資料庫查詢錯誤:', error); // 輸出具體的錯誤
        res.status(500).json({ message: '獲取優惠券歷史記錄時發生錯誤，請稍後再試。' });
    }
});

export default router;
