import React, { useState, useEffect } from 'react'
import UserSection from '@/components/user/common/user-section'
import styles from './index.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'

export default function UserInfo() {
  const { auth, getUser } = useAuth()
  const [userData, setUserData] = useState(auth.userData)
  // 獲取用戶信息
  const fetchUserData = async () => {
    try {
      const user = await getUser()
      setUserData(user)
    } catch (error) {
      console.error('獲取用戶信息失敗:', error)
    }
  }
  useEffect(() => {
    fetchUserData()
  }, [])

  // 構建頭像URL
  const avatarUrl = userData.img
    ? `http://localhost:3005/avatar/${userData.img}`
    : 'http://localhost:3005/avatar/avatar01.jpg'

  if (!auth.isAuth) return <></>

  return (
    <>
      <UserSection titleCN="個人資訊" titleENG="Information">
        <div
          className={`${styles.basicInformation} row d-flex justify-content-between`}
        >
          <div className={`col-9 ${styles.textArea}`}>
            <div>
              <h4>nickname</h4>
              <div className={`${styles.infoTable} p`}>
                <div>
                  <table>
                    <tbody>
                      <tr>
                        <th>
                          姓名<span> | name</span>
                        </th>
                        <td>{userData.name}</td>
                      </tr>
                      <tr>
                        <th>
                          信箱<span> | email</span>
                        </th>
                        <td>{userData.email}</td>
                      </tr>
                      <tr>
                        <th>
                          生日<span> | birthday</span>
                        </th>
                        <td>{userData.birthday}</td>
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
                        <td>
                          {' '}
                          {userData.gender === 1
                            ? '男士'
                            : userData.gender === 2
                            ? '女士'
                            : ''}
                        </td>
                      </tr>
                      <tr>
                        <th>
                          手機<span> | phone</span>
                        </th>
                        <td>{userData.phone}</td>
                      </tr>
                      <tr>
                        <th>
                          地址<span> | address</span>
                        </th>
                        <td>
                          {`${userData.city}${userData.area}${userData.address}`}
                        </td>
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
              src={avatarUrl}
              alt=""
            />
          </div>
          {/* 創建時間 */}
          <div
            className={`${styles.timeArea} "row d-flex justify-content-around align-items-center "`}
          >
            <div className="col-4">
              <table className="ms-4">
                <tbody>
                  <tr>
                    <th>
                      創建時間<span> | created time</span>
                    </th>
                    <td>{userData.created_at}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-4">
              <table className="ms-4">
                <tbody>
                  <tr>
                    <th>
                      更新時間<span> | updated time</span>
                    </th>
                    <td>{userData.updated_at}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="col-4 d-flex justify-content-end pe-2">
              <Link href="/user/information/update">
                <button className="btn-primary h6">編輯</button>
              </Link>
            </div>
          </div>

          <hr className="underline"></hr>

          {/* 積分 */}
          <div className="row d-flex py-5 align-items-center">
            <div className="col-10 d-flex align-items-center justify-content-between">
              <div className="col-6">
                <div
                  className={`row ${styles['level-area']} ${styles['table-title']} mt-2`}
                >
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    會員等級
                  </div>
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    會員現有積分
                  </div>
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    會員總積分
                  </div>
                </div>
                <div
                  className={`row ${styles['level-area']} ${styles['table-text']}`}
                >
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    {' '}
                    {userData.level === 1
                      ? '一般會員'
                      : userData.level === 2
                      ? '白金會員'
                      : userData.level === 3
                      ? '鑽石會員'
                      : ''}
                  </div>
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    points
                  </div>
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    points
                  </div>
                </div>
              </div>
              <div className="col-5">
                <div
                  className={`row ${styles['points-description']} ${styles['table-title']} mt-2`}
                >
                  <div className="col-8 d-flex justify-content-center align-items-center">
                    如何獲得點數?
                  </div>
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    折抵規則
                  </div>
                </div>
                <div
                  className={`row ${styles['points-description']} ${styles['table-text']}`}
                >
                  <div className="col-8 d-flex justify-content-center align-items-center">
                    消費滿300元即可獲得1點
                  </div>
                  <div className="col-4 d-flex justify-content-center align-items-center">
                    1點折1元
                  </div>
                </div>
              </div>
            </div>
            <div className="col-10 pt-3 mt-3 justify-content-center  gap-5 d-flex align-items-center">
              <Image src="/user/regular.svg" alt="" width={250} height={192} />
              <Image src="/user/platinum.svg" alt="" width={250} height={192} />
              <Image src="/user/diamond.svg" alt="" width={250} height={192} />
            </div>
          </div>
        </div>
      </UserSection>
    </>
  )
}
