import express from 'express'
import transporter from '#configs/mail.js'
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
      sevenRecipientEmail,
      storename,
      storeaddress,
      productCart,
      Workshopcart,
      coupon,
      userId,
    } = req.body

    //確認分解資料正確
    // console.log(recipientPhone)
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

    //處理名字跟信箱
    // 判斷使用者選擇的配送方式
    let recipientNameToUse, recipientEmailToUse
    let phone

    if (deliveryMethod == '1') {
      recipientNameToUse = recipientName
      recipientEmailToUse = recipientEmail
      phone = recipientPhone
    } else if (deliveryMethod == '2') {
      recipientNameToUse = sevenRecipientName
      recipientEmailToUse = sevenRecipientEmail
      phone = sevenRecipientPhone
    } else {
      recipientNameToUse = recipientName
      recipientEmailToUse = recipientEmail
    }

    // 創建訂單
    const sqlInsert = `INSERT INTO order_list 
    (user_id, payment_id, shipping_id, order_number, total_amount, recipient_name, phone, email, shipping_address, coupon_id, status)
    VALUES (${userId}, ${paymentId}, ${shippingId}, ${orderNumber}, ${totalPrice}, '${recipientNameToUse}','${phone}', '${recipientEmailToUse}', '${shippingAddress}', ${coupon ? coupon.coupon_list_id : 'NULL'}, '${status}')`

    const [result] = await db.query(sqlInsert, [
      userId, // user_id
      paymentId, // payment_id
      shippingId, // shipping_id
      orderNumber, // order_number
      totalPrice, // total_amount
      recipientNameToUse,
      phone,
      recipientEmailToUse,
      shippingAddress, // shipping_address
      status,
      coupon ? coupon.coupon_list_id : null,
    ])

    //result反回order_list的自增ID
    const orderId = result // 獲取自增 ID
    console.log('Query result:', result)

    // 利用訂單id創建商品訂單明細
    for (const product of productCart) {
      const sqlInsertDetail = `INSERT INTO order_item (order_id, product_id, color_id, workshop_id, quantity) VALUES (${orderId}, ${product.product_id}, ${product.color_id}, NULL,${product.qty})`
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

    // -----------更新課程人數
    for (const Workshop of Workshopcart) {
      const sqlUpdateStock = `
    UPDATE workshop_time
    SET registered = registered + 1
    WHERE workshop_id = 5
      AND date = '${Workshop.date}'
      AND start_time = '${Workshop.beginTime}';
  ` // 執行查詢
      await db.query(sqlUpdateStock)
    }

    //----------更新優惠券使用次數(11.11待修改)
    if (coupon) {
      const sqlUpdate1 = `
        UPDATE coupon_list
        SET used = used + 1
        WHERE id = ${coupon.coupon_list_id};
      `

      const sqlUpdate2 = `
        UPDATE coupon_relation
        SET order_id = ${orderId}
        WHERE user_id = ${userId} AND coupon_id = ${coupon.coupon_list_id};
      `

      await db.query(sqlUpdate1)
      await db.query(sqlUpdate2)
    }

    //利用訂單id創建課程訂單明細
    for (const Workshop of Workshopcart) {
      const sqlInsertDetail = `INSERT INTO order_item (order_id, product_id, color_id, workshop_id, quantity) VALUES (${orderId}, NULL, NULL, ${Workshop.id},${Workshop.qty})`
      await db.query(sqlInsertDetail, [orderId, Workshop.id, Workshop.qty])
    }
  } catch (error) {
    console.error('Error saving order:', error)
    res.status(500).json({ message: 'Error saving order', error })
  }
})

//----------------寄信利用訂單編號路由
router.get('/send', async function (req, res, next) {
  const orderNumber = req.query.orderNumber

  try {
    const sqlSelect = `
    SELECT *
    FROM order_list
    WHERE order_number = '${orderNumber}'
  `
    const [orderDetails] = await db.query(sqlSelect)

    const recipientName = orderDetails[0].recipient_name
    const recipientEmail = orderDetails[0].email

    const mailOptions = {
      from: `"Beautique" <${process.env.SMTP_TO_EMAIL}>`,
      to: recipientEmail || 'ss33660ss33660@gmail.com',
      subject: `您的訂單${orderNumber}已完成`,
      html: `
 <body
    style="
      background-color: #f9f9f9;
      padding: 0;
      margin: 0;
      font-family: Arial, sans-serif;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 30px auto;
        padding: 30px;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        color: #333;
      "
    >
      <header
        style="
          text-align: center;
          border-bottom: 2px solid #90957a;
          padding-bottom: 10px;
        "
      >
      
      <img src="https://i.ibb.co/6ynt8GF/Beautique.png" alt="Beautique" style="max-width: 150px;">

        <p style="font-size: 14px; color: #777">
          Where Beauty Meets Uniqueness
        </p>
      </header>

      <section style="padding:20px 30px; line-height: 1.6">
        <h2 style="color: #333; font-size: 20px">
          親愛的${recipientName || '顧客'}，您好!
        </h2>
        <p style="font-size: 16px; color: #555">
          感謝您的訂購，我們很高興通知您，訂單編號
          <strong style="color: #963827">${orderNumber}</strong>
          已經完成。我們將盡快安排出貨，讓您能夠早日收到商品。
        </p>
        <p style="font-size: 16px; color: #555">
          如有訂購課程，<strong style="color: #963827"
            >請留意開課日期</strong
          >，我們的老師將在開課前一日與您聯繫，請保持電話暢通。
        </p>
        <p style="font-size: 16px; color: #555">
          再次感謝您的選購，祝您使用愉快！
        </p>
      </section>

      <div style="text-align: center; margin: 20px 0">
        <a
          href="http://localhost:3000"
          style="
            display: inline-block;
            padding: 12px 24px;
            background-color: #90957a;
            color: #ffffff;
            text-decoration: none;
            font-weight: bold;
            border-radius: 4px;
          "
        >
          前往 Beautique
        </a>
      </div>

      <footer
        style="
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          font-size: 12px;
          color: #888;
        "
      >
        <p>這是一封自動產生的郵件，請勿回覆。</p>
        <p style="margin: 0">© 2024 Beautique. All rights reserved.</p>
      </footer>
    </div>
  </body>
    `,
    }

    // 發送郵件並處理回調
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        return res.status(400).json({ status: 'error', message: err.message })
      }

      // 如果郵件發送成功，回應資料
      res.json({ status: 'success', data: orderDetails })
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Server error' })
  }
})

export default router
