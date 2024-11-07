import express from 'express';
const router = express.Router();
import db from '#configs/db.js';

router.get('/:userId', async function (req, res, next) {
    const userId = req.params.userId; // 提取 userId
    console.log('User ID:', userId); // 日志检查 userId
    try {
        const sqlSelect = `SELECT 
    o.id AS order_id,
    o.order_number,
    o.total_amount,
    CONCAT('[', GROUP_CONCAT(
        DISTINCT CONCAT( 
            '{',
    '"id":', oi.id, ',',
    '"product_id":',IFNULL(oi.product_id, 'null'), ',',
    '"mainimage":"', IFNULL(c.mainimage, ''), '",',
    '"name":"', IFNULL(b.name, ''), '",',
    '"product_name":"', IFNULL(p.product_name, ''), '",',
    '"color":"', IFNULL(c.color, 'null'), '",',
    '"quantity":', oi.quantity, ',',
    '"price":', IFNULL(p.price, '0'), ',',
    '"wid":', IFNULL(w.id, 'null'), ',',
    '"type":"', IFNULL(wt.type, ''), '",',
    '"teachers_name":"', IFNULL(t.name, ''), '",',
    '"registration_start":"', IFNULL(w.registration_start, ''), '",',
    '"registration_end":"', IFNULL(w.registration_end, ''), '",',
    '"workshop_price":', IFNULL(w.price, '0'),
    '}'
        )
    ), ']') AS items
FROM 
    order_list o
JOIN 
    order_item oi ON o.id = oi.order_id
LEFT JOIN 
    product_list p ON oi.product_id = p.id
LEFT JOIN 
    color c ON oi.color_id = c.id
LEFT JOIN 
    workshop w ON oi.workshop_id = w.id
JOIN 
    user u ON o.user_id = u.id
LEFT JOIN 
    brand b ON p.brand_id = b.id
LEFT JOIN 
    workshop_type wt ON w.type_id = wt.id
LEFT JOIN 
    teachers t ON w.teachers_id = t.id
WHERE 
    o.user_id = ${userId}
GROUP BY 
    o.id;`;
        const [result] = await db.query(sqlSelect, [userId]); // 使用參數化查詢

        // 檢查結果
        if (!result || result.length === 0) {
            return res.status(404).json({ message: 'No order found for this user.' });
        }

        // 返回結果
        res.json(result);
        console.log('Query result:', result);
    } catch (error) {
        console.error('Database query error:', error); // 輸出錯誤日誌
        res.status(500).json({ message: 'Error fetching order. Please try again later.' });
    }
});

export default router;
