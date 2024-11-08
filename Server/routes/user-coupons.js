import express from 'express';
const router = express.Router();
import db from '#configs/db.js';

// 获取特定用户的优惠券
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId; // 获取 URL 参数中的 userId
    const { page = 1, limit = 10 } = req.query; // 获取分页参数，默认值是 page 1 和 limit 10

    console.log('User ID:', userId); // 日志检查 userId
    console.log('Page:', page, 'Limit:', limit); // 日志检查分页参数

    // 计算偏移量（OFFSET）
    const offset = (page - 1) * limit;

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
            ORDER BY coupon_relation.id DESC
            LIMIT ${limit} OFFSET ${offset}`;  // 加入分页的 LIMIT 和 OFFSET`;

    
        console.log('Executing query:', sqlSelect);
        console.log('With userId:', userId, 'Page:', page, 'Limit:', limit);

        // 传递分页参数给数据库查询
        const [result] = await db.query(sqlSelect, [limit, offset]);

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

router.get('/', async (req, res) => {
    const { userId, couponId } = req.query;

    if (!userId || !couponId) {
        return res.status(400).json({ error: '缺少必要的参数: userId 或 couponId' });
    }

    console.log('Received request:', { userId, couponId });  // 日志请求参数

    try {
        const result = await db.query(
            `SELECT * FROM coupon_relation WHERE user_id = ${userId} AND coupon_id = ${couponId}`
        );
        console.log(result)

        if (result[0].length > 0) {
            return res.json({ hasClaimed: true });
        } else {
            return res.json({ hasClaimed: false });
        }
    } catch (err) {
        console.error('Database error:', err);  // 打印数据库错误
        return res.status(500).json({ error: '数据库查询失败', details: err.message });
    }
});



router.post('/', async (req, res) => {
    const { userId, coupon_id } = req.body;
    console.log('Received userId:', userId);  // 打印 userId
    console.log('Received coupon_id:', coupon_id);  // 打印 couponId
    
    if (!userId || !coupon_id) {
        return res.status(400).json({ success: false, error: '缺少必要的参数' });
    }

    try {
        // 查询用户是否已经领取过此优惠券
        const result = await db.query(`SELECT * FROM coupon_relation WHERE user_id = ${userId} AND coupon_id = ${coupon_id}`);

        console.log(result)

        if (result[0].length > 0) {
            return res.status(400).json({ success: false, error: '您已经领取过此优惠券' });
        }

        // 添加优惠券领取记录
        await db.query(`INSERT INTO coupon_relation (user_id, coupon_id) VALUES (${userId}, ${coupon_id})`);

        return res.json({ success: true, message: '优惠券领取成功！' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: '領取優惠券時發生錯誤' });
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
