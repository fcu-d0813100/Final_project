import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

// //獲取會員id抓取優惠券返回前端
// router.get('/getCoupon', async function (req, res) {
//   const userId = req.query.userId // 從查詢參數獲取 userId

//   if (!userId) {
//     return res.status(400).json({ error: 'User ID is required' })
//   }

//   try {
//     const sqlSelect = `SELECT *
//     FROM
//     coupon_relatoin`
//     const [result] = await db.query(sqlSelect).catch((e) => console.log(e))
//     res.json(result)
//   } catch (error) {
//     console.error('Database query error:', error)
//     res
//       .status(500)
//       .json({ message: 'Error fetching coupons. Please try again later.' })
//   }
// })

//訂單提交路由
router.post('/checkout', async function (req, res, next) {
  try {
    console.log(req.body)
    console.log(JSON.stringify(req.body))
    const {
      paymentMethod,
      deliveryMethod,
      orderNumber,
      totalPrice,
      homeAdress,
      recipientName,
      recipientEmail,
      recipientPhone,
      sevenRecipientName,
      sevenRecipientPhone,
      storename,
      storeaddress,
      productCart,
      Workshopcart,
    } = req.body

    //確認分解資料正確
    // console.log(paymentMethod, deliveryMethod, orderNumber, totalDiscountPrice)
    let shippingAddress
    if (deliveryMethod == '1') {
      shippingAddress = homeAdress
    } else {
      shippingAddress = `${storename} ${storeaddress}`
    }
    //處理已付款跟未付款的狀態資訊
    let status
    if (paymentMethod == 1) {
      status = '未付款'
    } else if (paymentMethod == 2) {
      status = '已付款'
    }

    const shippingId = deliveryMethod
    const paymentId = paymentMethod

    // 創建訂單
    const sqlInsert = `INSERT INTO order_list 
    (user_id, payment_id, shipping_id, order_number, total_amount, shipping_address, coupon_id, status)
    VALUES (1, ${paymentId}, ${shippingId}, ${orderNumber}, ${totalPrice}, '${shippingAddress}', NULL, '${status}')`

    const [result] = await db.query(sqlInsert, [
      1, // user_id
      paymentId, // payment_id
      shippingId, // shipping_id
      orderNumber, // order_number
      totalPrice, // total_amount
      shippingAddress, // shipping_address
      status,
      // 這裡沒有 coupon_id，所以不應該有 ?
    ])

    //result反回order_list的自增ID
    const orderId = result // 獲取自增 ID
    console.log('Query result:', result)

    // 利用訂單id創建商品訂單明細
    for (const product of productCart) {
      const sqlInsertDetail = `INSERT INTO order_item (order_id, product_id, color_id, workshop_id, quantity, comment, rating, review_date, review_likes) VALUES (${orderId}, ${product.product_id}, ${product.color_id}, NULL,${product.qty}, NULL, NULL, NULL, NULL)`
      await db.query(sqlInsertDetail, [
        orderId,
        product.product_id,
        product.color_id,
        product.qty,
      ])
    }

    // -----------更新庫存數量
    for (const product of productCart) {
      const sqlUpdateStock = `
    UPDATE color
    SET stock = stock - ${product.qty}
    WHERE product_id = ${product.product_id} AND id = ${product.color_id}
  `
      await db.query(sqlUpdateStock)
    }

    //利用訂單id創建課程訂單明細
    for (const Workshop of Workshopcart) {
      const sqlInsertDetail = `INSERT INTO order_item (order_id, product_id, color_id, workshop_id, quantity, comment, rating, review_date, review_likes) VALUES (${orderId}, NULL, NULL, ${Workshop.id},${Workshop.qty}, NULL, NULL, NULL, NULL)`
      await db.query(sqlInsertDetail, [orderId, Workshop.id, Workshop.qty])
    }

    // res.send('回傳的資料如下：' + JSON.stringify(req.body))
    // res.status(201).json({ message: 'Order created successfully', orderId })
  } catch (error) {
    console.error('Error saving order:', error)
    res.status(500).json({ message: 'Error saving order', error })
  }
})

export default router
