import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import styles from './discount-box.module.scss'
import Form from 'react-bootstrap/Form'

export default function DiscountBox() {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <div onClick={handleShow} className={styles['checkout_discount']}>
        <span>優惠券</span>
        <span className="ps">輸入享有折扣 &gt;</span>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <div className={styles['modal-header']}>
          <div
            className={styles['close-button']}
            onClick={handleClose}
            style={{ cursor: 'pointer' }}
          >
            X
          </div>
        </div>
        <Modal.Body closeButton>
          <Form.Label>優惠券折扣</Form.Label>
          <Form.Select aria-label="Default select example">
            <option>選擇優惠券</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </Form.Select>
        </Modal.Body>
        <div>
          <button>確認</button>
        </div>
      </Modal>
    </>
  )
}
