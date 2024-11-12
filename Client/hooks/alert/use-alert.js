import { useCallback } from 'react'
import ReactDOMServer from 'react-dom/server'
import Swal from 'sweetalert2'
import { RiCloseCircleFill } from 'react-icons/ri'
import styles from './use-alert.module.scss'

//DEFAULT ICON red-cross

const useAlert = () => {
  const showAlert = useCallback(
    (message, icon = <RiCloseCircleFill color="#963827" />, timer = 1500) => {
      const iconHtml = ReactDOMServer.renderToString(icon)
      Swal.fire({
        html: `
      <div class="custom-alert-content">
        <span class="custom-icon">${iconHtml}</span>
        <span>${message}</span>
      </div>
      `,
        showConfirmButton: false,
        timer: timer,
        position: 'center',
        width: '300px',
        padding: '1em',
        customClass: {
          popup: `${styles['custom-popup']}`,
        },
      })
    },
    []
  )

  return showAlert
}

export default useAlert
