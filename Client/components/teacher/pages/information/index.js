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

      <div className="d-flex">
        <div className={styles.aside}></div>

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
        </div>
      </div>
    </>
  )
}
