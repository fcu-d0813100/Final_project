import express from 'express';
const router = express.Router();
import db from '#configs/db.js';

// 获取特定用户的优惠券
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId; // 获取 URL 参数中的 userId
    console.log('User ID:', userId); // 日志检查 userId

    try {
        const sqlSelect = `
            SELECT coupon_relation.*,
                   coupon_list.name,
                   coupon_list.discount_value,
                   coupon_list.minimum_amount,
                   coupon_list.end_date,
                   coupon_list.brand_id
            FROM coupon_relation 
            JOIN coupon_list ON coupon_relation.coupon_id = coupon_list.id
            JOIN user ON coupon_relation.user_id = user.id 
            WHERE coupon_relation.user_id = ${userId}
            ORDER BY coupon_relation.id DESC`;

        console.log('Executing query:', sqlSelect);
        console.log('With userId:', userId);
        const [result] = await db.query(sqlSelect, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'No coupons found for this user.' });
        }

        res.status(200).json({ success: true, data: result });
        console.log('Query result:', result);
    } catch (error) {
        console.error('Database query error:', error);
        res.status(500).json({ message: 'Error fetching coupons. Please try again later.' });
    }
});

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
// JOIN order_list ON order_list.coupon_id = coupon_list.id
        const [result] = await db.query(sqlSelect, [userId]);
        console.log(result);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: 'No coupons found for this user.' });
        }

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Database query error:', error); // 输出具体的错误
        res.status(500).json({ message: 'Error fetching coupons. Please try again later.' });
    }
});


export default router;
