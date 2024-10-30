'use client'
import styles from '@/components/teacher/common/information.module.scss'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

export default function index({
  name = '',
  account = '',
  email = '',
  birthday = '',
  years = '',
  gender = '',
  nation = '',
  teacherImg = '',
}) {
  return (
    <>
      <div className={styles.basicInformation}>
        <div className={styles.textArea}>
          <div>
            <h4>{name}</h4>
            <div className={`${styles.infoTable} p`}>
              <div>
                <table>
                  <tbody>
                    <tr>
                      <th>
                        帳戶<span> | account</span>
                      </th>
                      <td>{account}</td>
                    </tr>
                    <tr>
                      <th>
                        信箱<span> | email</span>
                      </th>
                      <td>{email}</td>
                    </tr>
                    <tr>
                      <th>
                        生日<span> | birthday</span>
                      </th>
                      <td>{birthday}</td>
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
                      <td>{years} 年</td>
                    </tr>
                    <tr>
                      <th>
                        性別<span> | gender</span>
                      </th>
                      <td>{gender}</td>
                    </tr>
                    <tr>
                      <th>
                        國籍<span> | nation</span>
                      </th>
                      <td>{nation}</td>
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
            src={teacherImg}
            alt=""
          />
        </div>
      </div>
    </>
  )
}
