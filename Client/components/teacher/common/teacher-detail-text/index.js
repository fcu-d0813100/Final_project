'use client'

import styles from '@/components/teacher/common/teacher-detail.module.scss'

import React, { useState, useEffect } from 'react'

export default function TeacherDetailText(props) {
  return (
    <>
      <div className={`${styles.section02} container`}>
        <div className={styles.textContent}>
          <div className="col p-0">
            <h4 className="h4">Slogan</h4>
            <p className="h6">
              “我喜歡贈送口紅。口紅如此豐富多變，一旦你用過了它們，你就離不開了！”
            </p>
          </div>
          <div className="col p-0">
            <h4 className="h4">About 關於</h4>
            <p className="h6">
              現任職彩妝藝術總監。身為一個表演者，我喜歡後台的能量和創造力，但無論在哪裡
              - 在世界各地教授彩妝大師班，在全球舉行活動或參與密集的時裝週活動 -
              品牌的多樣性仍然是我持續的靈感來源。
            </p>
          </div>
          <div className="col p-0">
            <h4 className="h4">Experience 經歷</h4>
            <p className="h6">
              擔任 M.A.C 彩妝藝術總監17年。
              <br />與 Grace Jones 一起合作，並由 Jean-Paul Goude
              負責拍攝V雜誌封面。
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
