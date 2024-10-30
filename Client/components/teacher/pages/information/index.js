'use client'
import TPersonalMoreInfo from '@/components/teacher/common/t-dashboard-personal-moreinfo'
import TPersonalInfo from '@/components/teacher/common/t-dashboard-personal-info'
import DashboardTitle from '@/components/shared/dashboard-title-y'
import TDashboardBN from '@/components/teacher/common/t-dashboard-bn'
import styles from '@/components/teacher/common/information.module.scss'
import React, { useState, useEffect } from 'react'

export default function TeacherInformation(props) {
  return (
    <>
      <TDashboardBN teacher="Gina Bettelli" />

      <div>
        <div className={styles.aside}></div>

        <div className={styles.main}>
          <DashboardTitle chTitle="個人資訊" enTitle="Information" />

          <TPersonalInfo
            name="Gina Bettelli"
            account="Gina-Bettelli"
            email="ginabettelli@gmail.com"
            birthday="1987.03.30"
            years="17"
            gender="女"
            nation="美國"
            teacherImg="/teacher/teachers_img/T_1_color.jpg"
          />

          <hr className="opacity-75" />

          <TPersonalMoreInfo
            slogan=" “我喜歡贈送口紅。口紅如此豐富多變，一旦你用過了它們，你就離不開了！”"
            about="現任職彩妝藝術總監。身為一個表演者，我喜歡後台的能量和創造力，但無論在哪裡 - 在世界各地教授彩妝大師班，在全球舉行活動或參與密集的時裝週活動 - 品牌的多樣性仍然是我持續的靈感來源。"
            experience="擔任 M.A.C 彩妝藝術總監 17年與 Grace Jones 一起合作，並由 Jean-Paul Goude 負責拍攝V雜誌封面。"
          />

          <div className={`${styles.button} d-flex`}>
            <button className="btn-primary h6 ms-auto">編輯</button>
          </div>
        </div>
      </div>
    </>
  )
}
