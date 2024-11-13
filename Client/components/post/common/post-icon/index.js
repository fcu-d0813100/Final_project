import React, { useState, useEffect } from 'react'
import styles from './index.module.scss'
import {
  PiHeartStraight,
  PiHeartStraightFill,
  PiChatCircle,
} from 'react-icons/pi'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'

import ModalConfirm from '@/components/shared/modal-confirm'

import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'
export default function PostIcon({
  id,
  icon,
  size = 26,
  count,
  initialToggled,
  onToggle,
}) {
  const [toggled, setToggled] = useState(initialToggled)
  const { auth } = useAuth()
  const userId = auth.userData.id
  const [showModal, setShowModal] = useState(false) // modal state
  const router = useRouter()

  const icons = {
    like: toggled ? (
      <FgThumbUpFill fill="#8A8A8A" size={size} />
    ) : (
      <FgThumbsUp size={size} />
    ),
    save: toggled ? (
      <PiHeartStraightFill fill="#963827" size={size} />
    ) : (
      <PiHeartStraight size={size} />
    ),
    comment: toggled ? <PiChatCircle /> : <PiChatCircle />,
  }
  const toggleHandle = async () => {
    if (!userId || userId == 0) {
      setShowModal(true)
      return
    }
    const newToggled = !toggled
    setToggled(newToggled)

    if (onToggle) {
      await onToggle(id, newToggled)
    }
    // forceAllCard()
  }

  useEffect(() => {
    setToggled(initialToggled)
  }, [initialToggled])

  return (
    <>
      <div onClick={toggleHandle} className={styles['post-icon']}>
        <div>{icons[icon]}</div>
        <span>{count}</span>
      </div>
      {showModal && (
        <ModalConfirm
          title="尚未登入會員"
          content={`是否前往登入?`}
          btnConfirm="前往登入"
          ConfirmFn={() => {
            router.push('/user/login')
          }}
          show={showModal}
          handleClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
