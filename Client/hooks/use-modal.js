import React, { createContext, useContext, useState } from 'react'
import ModalConfirm from '@/components/shared/modal-confirm'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'

const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
  const [show, setShow] = useState(false)
  const router = useRouter()
  const { auth } = useAuth()
  const isLoggedIn = !!auth.userData?.id

  const showModal = () => setShow(true)
  const hideModal = () => setShow(false)

  //convert to boolean & 取反
  const ensureLoggedIn = (callback) => {
    if (!isLoggedIn) {
      showModal()
      return false
    }
    callback?.()
    return true
  }

  return (
    <ModalContext.Provider value={{ ensureLoggedIn }}>
      {children}
      {show && (
        <ModalConfirm
          title="尚未登入會員"
          content="是否前往登入？"
          btnConfirm="前往登入"
          ConfirmFn={() => {
            hideModal()
            setTimeout(() => router.push('/user/login/user'), 1000)
          }}
          show={showModal}
          handleClose={hideModal}
        />
      )}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)
