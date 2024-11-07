import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

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
    if (deliveryMethod == 'home') {
      shippingAddress = homeAdress
    } else {
      shippingAddress = `${storename} ${storeaddress}`
    }
    const shippingId = deliveryMethod
    const paymentId = paymentMethod

    // 創建訂單
    const sqlInsert = `INSERT INTO order_list 
    (user_id, payment_id, shipping_id, order_number, total_amount, shipping_address, coupon_id, status)
    VALUES (1, ${paymentId}, ${shippingId}, ${orderNumber}, ${totalPrice}, '${shippingAddress}', NULL, '未付款')`

    const [result] = await db.query(sqlInsert, [
      1, // user_id
      paymentId, // payment_id
      shippingId, // shipping_id
      orderNumber, // order_number
      totalPrice, // total_amount
      shippingAddress, // shipping_address
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
