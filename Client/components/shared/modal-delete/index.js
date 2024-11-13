import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { X } from '@phosphor-icons/react'
import styles from './index.module.scss'
export default function Index({
  title,
  content,
  btnConfirm,
  btnCancel,
  ConfirmFn,
  show,
  handleClose,
}) {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        className={styles['modal']}
      >
        <Modal.Header closeButton className={styles['modal-header']}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles['modal-body']}>
          <span style={{ whiteSpace: 'pre-line' }}>{content}</span>
        </Modal.Body>
        <Modal.Footer className={styles['modal-footer']}>
          <Button
            onClick={() => {
              ConfirmFn()
            }}
            className={`btn-danger ${styles['btn']}`}
          >
            {btnConfirm}
          </Button>
          <Button
            onClick={handleClose}
            className={`btn-secondary ${styles['btn']}`}
          >
            {btnCancel}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
