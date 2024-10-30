import express from 'express';
const router = express.Router();

import { Coupon } from '#models'; // 假設您已設置 Sequelize 並匯入 Coupon 模型

// 新增優惠券
router.post('/add', async (req, res) => {
  const { code, name, discount_value, minimum_amount, start_date, end_date, maximum } = req.body;

  try {
    const newCoupon = await Coupon.create({
      code,
      name,
      discount_value,
      minimum_amount,
      start_date,
      end_date,
      used: 0,  // 初始使用次數為 0
      maximum,
      valid: 1,  // 初始設為有效
    });
    res.json({ status: 'success', data: newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: '新增優惠券失敗' });
  }
});

// 查詢所有有效的優惠券
router.get('/list', async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      where: { valid: 1 },
      raw: true
    });
    res.json({ status: 'success', data: coupons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: '查詢優惠券失敗' });
  }
});

// 兌換優惠券
router.post('/claim', async (req, res) => {
  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({
      where: {
        code,
        valid: 1,
      },
    });

    // 檢查優惠券是否存在
    if (!coupon) {
      return res.status(404).json({ status: 'error', message: '無效的優惠券代碼' });
    }

    // 檢查使用次數是否達到上限
    if (coupon.used >= coupon.maximum) {
      return res.status(400).json({ status: 'error', message: '優惠券已被使用完畢' });
    }

    // 更新使用次數
    coupon.used += 1;
    await coupon.save();

    res.json({ status: 'success', data: { discountValue: coupon.discount_value } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: '兌換優惠券失敗' });
  }
});

// 設定優惠券失效
router.post('/invalidate', async (req, res) => {
  const { id } = req.body;

  try {
    const coupon = await Coupon.findByPk(id);

    if (!coupon) {
      return res.status(404).json({ status: 'error', message: '找不到優惠券' });
    }

    coupon.valid = 0;
    await coupon.save();

    res.json({ status: 'success', data: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: '設置優惠券無效失敗' });
  }
});

export default router;
