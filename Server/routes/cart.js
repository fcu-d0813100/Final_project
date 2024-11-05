import express from 'express'
const router = express.Router()
import db from '#configs/db.js'

router.post('/checkout', async function (req, res, next) {
  try {
    console.log(req.body) // 應該會顯示接收到的 JSON 資料
    console.log(JSON.stringify(req.body))
    // res.send('回傳的資料如下：' + JSON.stringify(req.body))
    const {
      paymentMethod,
      deliveryMethod,
      orderNumber,
      totalDiscountPrice,
      storename,
      storeaddress,
      productCart,
      Workshopcart,
    } = req.body

    //確認分解資料正確
    console.log(paymentMethod, deliveryMethod, orderNumber, totalDiscountPrice)
    const shippingId = deliveryMethod
    const paymentId = paymentMethod
    const shippingAddress = `${storename} ${storeaddress}`
    console.log(
      orderNumber,
      totalDiscountPrice,
      shippingAddress,
      shippingId,
      paymentId
    )

    // 創建訂單
    const sqlInsert = `INSERT INTO order_list 
    (user_id, payment_id, shipping_id, order_number, total_amount, shipping_address, coupon_id)
    VALUES (1, ${paymentId}, ${shippingId}, ${orderNumber}, ${totalDiscountPrice}, '${shippingAddress}', NULL)`

    const [result] = await db.query(sqlInsert, [
      1, // user_id
      paymentId, // payment_id
      shippingId, // shipping_id
      orderNumber, // order_number
      totalDiscountPrice, // total_amount
      shippingAddress, // shipping_address
      // 這裡沒有 coupon_id，所以不應該有 ?，只需去掉
    ])

    // const orderId = result[0].insertId // 獲取創建的訂單id
    // console.log(`New order created with ID: ${orderId}`)
    // console.log(`New order created with ID: ${orderId}`)
    // console.log(`New order created with ID: ${orderId}`)
    // console.log(`New order created with ID: ${orderId}`)

    //利用訂單id創建訂單明細
    // for (const product of productCart) {
    //   const sqlInsertDetail = `INSERT INTO order_item (order_id, product_id, color_id, workshop_id, quantity, comment, rating, review_date, review_likes) VALUES (${orderId}, ${product.product_id}, ${product.color_id}, NULL,${product.qty}, NULL, NULL, NULL, NULL)`
    //   await db.query(sqlInsertDetail, [
    //     orderId,
    //     product.product_id,
    //     product.color_id,
    //     product.qty,
    //   ])
    // }

    //利用訂單id創建訂單明細
    // for (const Workshop of Workshopcart) {
    //   const sqlInsertDetail = `INSERT INTO order_detail (order_id, product_id, quantity, price) VALUES (?,?,?,?,?)`
    //   await db.query(sqlInsertDetail, [
    //     orderId, // order_id
    //     Workshop.id, // product_id
    //     Workshop.quantity, // quantity
    //     Workshop.price, // price
    //   ])
    // }

    // res.send('回傳的資料如下：' + JSON.stringify(req.body))
    // res.status(201).json({ message: 'Order created successfully', orderId })
  } catch (error) {
    console.error('Error saving order:', error)
    res.status(500).json({ message: 'Error saving order', error })
  }
})

export default router

//測試
// import express from 'express'
// const router = express.Router()
// import db from '#configs/db.js'

// router.post('/checkout', async function (req, res, next) {
//   console.log(req.body) // 應該會顯示接收到的 JSON 資料
//   console.log(JSON.stringify(req.body))
//   res.send('回傳的資料如下：' + JSON.stringify(req.body))
// })

// export default router
