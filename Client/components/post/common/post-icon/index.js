import React, { useState, useEffect } from 'react'
import {
  PiHeartStraight,
  PiHeartStraightFill,
  PiChatCircle,
} from 'react-icons/pi'
import { useModal } from '@/hooks/use-modal'
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma'
import styles from './index.module.scss'

export default function PostIcon({
  id,
  icon,
  size = 26,
  count,
  initialToggled,
  onToggle,
}) {
  const [toggled, setToggled] = useState(initialToggled)

  const { ensureLoggedIn } = useModal()

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
    if (!ensureLoggedIn()) return

    const newToggled = !toggled
    setToggled(newToggled)

    if (onToggle) {
      await onToggle(id, newToggled)
    }
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
    </>
  )
}
