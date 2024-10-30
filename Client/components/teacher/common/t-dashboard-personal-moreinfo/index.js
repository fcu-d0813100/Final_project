'use client'
import styles from '@/components/teacher/common/information.module.scss'
import React, { useState, useEffect } from 'react'

export default function TPersonalMoreInfo({ slogan='', about='', experience='' }) {
  return (
    <>
      <div className={styles.moreInformation}>
        <div className={`d-flex row-cols-3 p-5 ${styles.moretextArea}`}>
          <div className="px-5">
            <h4 className="h4">我的 Slogan</h4>
            <p className="p">{slogan}</p>
          </div>
          <div className="px-5">
            <h4 className="h4">關於我 About me</h4>
            <p className="p">{about}</p>
          </div>
          <div className="px-5">
            <h4 className="h4">經歷 Experience</h4>
            <p className="p">{experience}</p>
          </div>
        </div>
      </div>
    </>
  )
}
