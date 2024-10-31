import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import UserSection from '@/components/user/common/user-section';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.module.scss';
import Image from 'next/image';
export default function index({
  name = '王美美',
  nickname = 'Bella',
  email = 'bella32@gmail.com',
  birthday = '2001.05.05',
  gender = '女士',
  phone = '0912345678',
  address = '台北市信義區市府路1號',
  Img = '',
  created_at = '2023.05.05',
  updated_at = '2024.10.05',
  points = '100',
}) {
  return (
    <>
      <UserSection titleCN="個人資訊" titleENG="Information">
        <div className={`${styles.basicInformation} row d-flex justify-content-between`}>
          <div className={`col-9 ${styles.textArea}`}>
            <div>
              <h4>{nickname}</h4>
              <div className={`${styles.infoTable} p`}>
                <div>
                  <table>
                    <tbody>
                      <tr>
                        <th>
                          姓名<span> | name</span>
                        </th>
                        <td>{name}</td>
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
                          稱謂<span> | title</span>
                        </th>
                        <td>{gender}</td>
                      </tr>
                      <tr>
                        <th>
                          手機<span> | phone</span>
                        </th>
                        <td>{phone}</td>
                      </tr>
                      <tr>
                        <th>
                          地址<span> | address</span>
                        </th>
                        <td>{address}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.userImg} col-3 `}>
            <Image
              width={255}
              height={255}
              className={styles.img}
              src="/user/img/avatar02.jpg"
              alt=""
            />
          </div>
          {/* 創建時間 */}
          <div className={`${styles.timeArea} "row d-flex justify-content-around align-items-center "`}>
            <div className='col-4'>
              <table className="ms-4">
                <tbody>
                  <tr>
                    <th>
                      創建時間<span> | created time</span>
                    </th>
                    <td>{created_at}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='col-4'>
              <table className="ms-4">
                <tbody>
                  <tr>
                    <th>
                      更新時間<span> | updated time</span>
                    </th>
                    <td>{updated_at}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='col-4 d-flex justify-content-end pe-2'>
              <button className="btn-primary h6">編輯</button>
            </div>
          </div>

          <hr className="underline"></hr>

          {/* 積分 */}
          <div className="row d-flex align-items-center">
            <div className='col-10 d-flex align-items-center justify-content-between'>
              <div className="col-6">
                <div className={`row ${styles['level-area']} ${styles['table-title']} mt-2`}>
                  <div className="col-4 d-flex justify-content-center align-items-center">會員等級</div>
                  <div className="col-4 d-flex justify-content-center align-items-center">會員現有積分</div>
                  <div className="col-4 d-flex justify-content-center align-items-center">會員總積分</div>
                </div>
                <div className={`row ${styles['level-area']} ${styles['table-text']}`}>
                  <div className="col-4 d-flex justify-content-center align-items-center">一般會員</div>
                  <div className="col-4 d-flex justify-content-center align-items-center">{points}</div>
                  <div className="col-4 d-flex justify-content-center align-items-center">{points}</div>
                </div>
              </div>
              <div className="col-5" >
                <div className={`row ${styles['points-description']} ${styles['table-title']} mt-2`}>
                  <div className="col-8 d-flex justify-content-center align-items-center">如何獲得點數?</div>
                  <div className="col-4 d-flex justify-content-center align-items-center">折抵規則</div>
                </div>
                <div className={`row ${styles['points-description']} ${styles['table-text']}`}>
                  <div className="col-8 d-flex justify-content-center align-items-center">消費滿300元即可獲得1點</div>
                  <div className="col-4 d-flex justify-content-center align-items-center">1點折1元</div>
                </div>
              </div>
            </div>
            <div className="col-12 p-0  gap-5 d-flex align-items-center">
              <Image src="/user/regular.svg" width={224} height={172} />
              <Image src="/user/platinum.svg" width={224} height={172} />
              <Image src="/user/diamond.svg" width={224} height={172} />
            </div>
          </div>
        </div>

      </UserSection>
    </>
  )
}