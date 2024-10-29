'use client'

import styles from '@/components/teacher/common/teacher-detail.module.scss'

import React, { useState, useEffect } from 'react'

export default function TeacherDetailText(
  {slogan = '',
  about = '',
  experience = ''}
) {
  return (
    <>
      <div className={`${styles.section02} container`}>
        <div className={styles.textContent}>
          <div className="col p-0">
            <h4 className="h4">Slogan</h4>
            <p className="h6">{slogan}</p>
          </div>
          <div className="col p-0">
            <h4 className="h4">About 關於</h4>
            <p className="h6">{about}</p>
          </div>
          <div className="col p-0">
            <h4 className="h4">Experience 經歷</h4>
            <p className="h6">{experience}</p>
          </div>
        </div>
      </div>
    </>
  )
}
