import React from 'react'
import Link from 'next/link';
import { IoIosAddCircleOutline } from "react-icons/io";
import styles from './index.module.scss'

export default function index({ CN, ENG }) {
  return (
    <>
      <div className={styles['post-title']}>
        <span className="h3 p-2">{CN}</span>
        <span className="h1-L">{ENG}</span>
      </div>
    </>
  )
}
