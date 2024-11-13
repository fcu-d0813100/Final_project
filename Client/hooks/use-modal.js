import React, { createContext, useContext, useState } from 'react'
import ModalConfirm from '@/components/shared/modal-confirm'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks/use-auth'

const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  const { auth } = useAuth()
  const isLoggedIn = !!auth.userData?.id

  const showLoginModal = () => setShowModal(true)
  const hideLoginModal = () => setShowModal(false)

  const ensureLoggedIn = (callback) => {
    if (!isLoggedIn) {
      showLoginModal()
      return false
    }
    callback?.()
    return true
  }

  return (
    <ModalContext.Provider
      value={{ showLoginModal, hideLoginModal, ensureLoggedIn }}
    >
      {children}
      {showModal && (
        <ModalConfirm
          title="尚未登入會員"
          content="是否前往登入？"
          btnConfirm="前往登入"
          ConfirmFn={() => {
            hideLoginModal()
            router.push('/user/login/user')
          }}
          show={showModal}
          handleClose={hideLoginModal}
        />
      )}
    </ModalContext.Provider>
  )
}

export const useModal = () => useContext(ModalContext)
