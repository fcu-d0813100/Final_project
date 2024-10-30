'use client'
import styles from '@/components/teacher/common/information.module.scss'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

export default function TeacherInformation(props) {
  return (
    <>
      <div className={styles.section1}>
        <div>
          <h1 className="h1-L mb-2">WELCOME</h1>
          <p className="h3">TEACHER - Gina Bettelli !</p>
        </div>
      </div>

      <div>
        <div className={styles.aside}>1</div>

        <div className={styles.main}>
          <div className={styles.dashboardTitle}>
            <p className="h3">個人資訊</p>
            <h1 className="h1-L">Information</h1>
          </div>

          <div className={styles.basicInformation}>
            <div className={styles.textArea}>
              <div>
                <h4>Gina Bettelli</h4>
                <div className={`${styles.infoTable} p`}>
                  <div>
                    <table>
                      <tbody>
                        <tr>
                          <th>
                            姓名<span> | name</span>
                          </th>
                          <td>Gina Bettelli</td>
                        </tr>
                        <tr>
                          <th>
                            信箱<span> | email</span>
                          </th>
                          <td>ginabettelli@gmail.com</td>
                        </tr>
                        <tr>
                          <th>
                            生日<span> | birthday</span>
                          </th>
                          <td>1987.03.30</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <table className="ms-4">
                      <tbody>
                        <tr>
                          <th>
                            資歷<span> | years of experience</span>
                          </th>
                          <td>17 年</td>
                        </tr>
                        <tr>
                          <th>
                            性別<span> | gender</span>
                          </th>
                          <td>女</td>
                        </tr>
                        <tr>
                          <th>
                            國籍<span> | nation</span>
                          </th>
                          <td>美國</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.TeacherImg}>
              <Image
                width={255}
                height={255}
                className={styles.img}
                src="/teacher/teachers_img/T_1_color.jpg"
              />
            </div>
          </div>

          <hr className="opacity-75" />

          <div className={styles.moreInformation}>
            <div className={`d-flex row-cols-3 p-5 ${styles.moretextArea}`}>
              <div className="px-5">
                <h4 className="h4">我的 Slogan</h4>
                <p className="p">
                  “我喜歡贈送口紅。
                  口紅如此豐富多變，一旦你用過了它們，你就離不開了！”
                </p>
              </div>
              <div className="px-5">
                <h4 className="h4">關於我 About me</h4>
                <p className="p">
                  現任職彩妝藝術總監。身為一個表演者，我喜歡後台的能量和創造力，但無論在哪裡
                  -
                  在世界各地教授彩妝大師班，在全球舉行活動或參與密集的時裝週活動
                  - 品牌的多樣性仍然是我持續的靈感來源。
                </p>
              </div>
              <div className="px-5">
                <h4 className="h4">經歷 Experience</h4>
                <p className="p">
                  擔任 M.A.C 彩妝藝術總監 17年與 Grace Jones 一起合作，並由
                  Jean-Paul Goude 負責拍攝V雜誌封面。
                </p>
              </div>
            </div>
          </div>
          <div className="d-flex">
            <button className="btn-primary h6 ms-auto">編輯</button>
          </div>
        </div>
      </div>
    </>
  )
}
