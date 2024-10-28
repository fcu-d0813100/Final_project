import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import { PiThumbsUp, PiChatCircle } from 'react-icons/pi';
// import { RiThumbUpLine, RiThumbUpFill } from 'react-icons/ri';
import { FgThumbsUp, FgThumbUpFill } from '@/components/icons/figma';

export default function ReplyInfo({
  onReplyClick = () => {},
  username,
  datetime,
  replyContent,
  likeCount,
  replyCount,
}) {
  const userRef = useRef();
  const replyRef = useRef();
  const [active, setActive] = useState(false);
  const handle = () => {
    setActive(!active);
  };
  const icon = {
    default: <FgThumbsUp height="24" width="24" fill="#8A8A8A" />,
    hover: <FgThumbUpFill height="24" width="24" fill="#8A8A8A" />,
  };
  const replyHandle = () => {
    let user = userRef.current.textContent;
    user = '回覆 ' + user;
    const text = replyRef.current.textContent;
    // if (typeof onReplyClick === 'function') {
    onReplyClick(text, user); // 傳遞回父組件
    // }
  };

  return (
    <>
      <div className={styles['reply-info']}>
        <div className={styles['user-name']}>
          <span ref={userRef}>{username}</span>
          <span>{datetime}</span>
        </div>
        <div className={styles['user-reply']} ref={replyRef}>
          {replyContent}
        </div>
        <div className={styles['post-icons']}>
          <div className={styles['like']}>
            <div onClick={handle}>{active ? icon.hover : icon.default}</div>
            <span>{likeCount}</span>
          </div>
          <div className={styles['reply']} onClick={replyHandle}>
            <PiChatCircle size={24} fill="#8A8A8A" />
            <span>{replyCount > 0 ? replyCount : `回覆`}</span>
          </div>
        </div>
      </div>
    </>
  );
}
