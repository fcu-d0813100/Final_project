import express from 'express';
const router = express.Router();
import db from '#configs/db.js'; // 確保 db 對象正確導入並能使用

/* GET coupons for a specific admin. */
router.get('/', async (req, res) => {
    try {
        // 定义 SQL 查询
        const sqlSelect = `
            SELECT coupon_list.*
            FROM coupon_list
            WHERE coupon_list.valid = 1`;

        // 執行查詢
        const [result] = await db.query(sqlSelect);

        // 检查结果
        if (result.length === 0) {
            return res.status(404).json({ message: 'No coupons found for this admin.' });
        }

        // 返回结果
        res.json(result);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Error fetching coupons. Please try again later.' });
    }
});



export default router;
