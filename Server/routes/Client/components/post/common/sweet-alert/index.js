import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import styles from './index.module.scss'

export default function CustomAlert({ message, icon, show }) {
  useEffect(() => {
    if (show) {
      Swal.fire({
        html: `
          <div class="custom-alert-content">
            <span class="custom-icon">${icon}</span>
            <span>${message}</span>
          </div>
        `,
        showConfirmButton: false,
        timer: 1500,
        position: 'center',
        width: '300px',
        padding: '1em',
        customClass: {
          popup: `${styles['custom-popup']}`,
        },
      })
    }
  }, [show])

  return null
}
