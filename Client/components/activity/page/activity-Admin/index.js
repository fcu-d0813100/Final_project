import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Tab, Nav } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './index.module.scss'
import UserCard from '../../common/userCard'
import UserSection from '@/components/user/common/user-section'
import { PiPlus } from 'react-icons/pi'
export default function Index(props) {
  return (
    <>
      <UserSection titleCN="活動管理" titleENG="New activity">
        <Tab.Container defaultActiveKey="/pdlike">
          <div className={styles['post-navbar']}></div>
          <Tab.Content>
            <Tab.Pane eventKey="/pdlike"></Tab.Pane>
            <div className={`${styles['card-Area']} d-flex mt-5`}>
              <Link href="#">
                <UserCard />
              </Link>

              <Link href="#">
                <button className={styles['new-act']}>
                  <div className="text-center">
                    <PiPlus className={styles.plus} />
                    <p className={`${styles.picUploadText} h4 mt-3`}>
                      新增活動
                    </p>
                  </div>
                </button>
              </Link>
            </div>

            <Tab.Pane eventKey="/classlike">
              <div className={`row ${styles.line} `}>
                <div
                  className={`col-12 ${styles['favorite-area']} d-flex justify-content-center align-items-center `}
                >
                  <h5 className="h5">目前沒有報名活動</h5>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                  <h5 className="p">請先至活動頁面完成報名</h5>
                </div>
                <div className="col-12 d-flex justify-content-center align-items-center mt-5">
                  <Link href="/activity" passHref>
                    <button className="btn-primary h6">前往報名</button>
                  </Link>
                </div>
              </div>
              {/* <div className={`row ${styles.interested}`}>
                <h6 className="h4">猜你可能感興趣</h6>
              </div> */}
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </UserSection>
    </>
  )
}
