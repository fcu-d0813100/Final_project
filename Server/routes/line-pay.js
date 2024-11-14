import express from 'express'
const router = express.Router()

import db from '#configs/db.js'
import authenticate from '#middlewares/authenticate.js'
import { createLinePayClient } from 'line-pay-merchant'
import { v4 as uuidv4 } from 'uuid'
import 'dotenv/config.js'

const linePayClient = createLinePayClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecretKey: process.env.LINE_PAY_CHANNEL_SECRET,
  env: process.env.NODE_ENV,
})

router.post('/create-order', authenticate, async (req, res) => {
  const userId = req.user.id
  const orderId = uuidv4()
  const packageId = uuidv4()

  const order = {
    orderId: orderId,
    currency: 'TWD',
    amount: req.body.amount,
    packages: [
      {
        id: packageId,
        amount: req.body.amount,
        products: req.body.products,
      },
    ],
    options: { display: { locale: 'zh_TW' } },
  }

  const dbOrder = {
    id: orderId,
    user_id: userId,
    amount: req.body.amount,
    status: 'pending',
    order_info: JSON.stringify(order),
  }

  const sqlInsertOrder = `
    INSERT INTO Purchase_Order (id, user_id, amount, status, order_info)
    VALUES ('${dbOrder.id}', '${dbOrder.user_id}', '${dbOrder.amount}', '${dbOrder.status}', '${dbOrder.order_info}')
  `

  try {
    await db.query(sqlInsertOrder)
    res.json({ status: 'success', data: { order } })
  } catch (error) {
    console.error('Database insert error:', error)
    res.status(500).json({ status: 'error', message: 'Order creation failed' })
  }
})

router.get('/reserve', async (req, res) => {
  // if (!req.query.orderId) {
  //   return res.json({ status: 'error', message: 'Order ID 不存在' })
  // }

  // const orderId = req.query.orderId
  // const redirectUrls = {
  //   confirmUrl: process.env.REACT_REDIRECT_CONFIRM_URL,
  //   cancelUrl: process.env.REACT_REDIRECT_CANCEL_URL,
  // }

  // const sqlSelectOrder = `SELECT * FROM Purchase_Order WHERE id = '${orderId}'`
  // const [orderRecord] = await db.query(sqlSelectOrder)
  // const order = JSON.parse(orderRecord[0].order_info)

  const testOrder = {
    amount: 1500,
    currency: 'TWD',
    orderId: '202112160123213210663',
    packages: [
      {
        id: 'c99abc79-3b29-4f40-8851-555785623',
        amount: 1500,
        products: [
          {
            name: 'Product Name1',
            quantity: 1,
            price: 500,
          },
          {
            name: 'Product Name2',
            quantity: 2,
            price: 500,
          },
        ],
      },
    ],
    redirectUrls: {
      confirmUrl: 'http://localhost:3000/pay-confirm',
      cancelUrl: 'http://localhost:3000/pay-cancel',
    },
  }

  try {
    const linePayResponse = await linePayClient.request.send({
      body: testOrder,
    })

    // const reservation = { ...order, ...linePayResponse.body.info }
    // const sqlUpdateOrder = `
    //   UPDATE Purchase_Order
    //   SET reservation = '${JSON.stringify(reservation)}', transaction_id = '${reservation.transactionId}'
    //   WHERE id = '${orderId}'
    // `
    // await db.query(sqlUpdateOrder)

    res.redirect(linePayResponse.body.info.paymentUrl.web)
  } catch (error) {
    console.error('Line Pay request error:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Line Pay request failed' })
  }
})

router.get('/confirm', async (req, res) => {
  const transactionId = req.query.transactionId

  const sqlSelectOrder = `SELECT * FROM Purchase_Order WHERE transaction_id = '${transactionId}'`
  const [orderRecord] = await db.query(sqlSelectOrder)
  const transaction = JSON.parse(orderRecord[0].reservation)
  const amount = transaction.amount

  try {
    const linePayResponse = await linePayClient.confirm.send({
      transactionId: transactionId,
      body: { currency: 'TWD', amount: amount },
    })

    let status = linePayResponse.body.returnCode === '0000' ? 'paid' : 'fail'

    const sqlUpdateOrder = `
      UPDATE Purchase_Order 
      SET status = '${status}', return_code = '${linePayResponse.body.returnCode}', confirm = '${JSON.stringify(linePayResponse.body)}'
      WHERE id = '${orderRecord[0].id}'
    `
    await db.query(sqlUpdateOrder)

    res.json({ status: 'success', data: linePayResponse.body })
  } catch (error) {
    console.error('Line Pay confirm error:', error)
    res.json({ status: 'fail', data: error })
  }
})

router.get('/check-transaction', async (req, res) => {
  const transactionId = req.query.transactionId

  try {
    const linePayResponse = await linePayClient.checkPaymentStatus.send({
      transactionId: transactionId,
      params: {},
    })
    res.json(linePayResponse.body)
  } catch (error) {
    console.error('Transaction check error:', error)
    res.json({ error })
  }
})

export default router
