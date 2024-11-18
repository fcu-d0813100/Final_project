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
    ? `http://localhost:3005/avatar/${userData.img}` // 使用本地檔案頭像
    : userData.photo_url
    ? userData.photo_url // 使用 photo_url（如 Google/LINE 登入的圖片）
    : 'http://localhost:3005/avatar/avatar01.jpg' // 預設頭像

  if (!auth.isAuth) return <></>

  return (
    <>
      <UserSection titleCN="個人資訊" titleENG="Information">
        <div className={`${styles.basicInformation} container row`}>
          <div className={`col-12 col-xxl-9 ms-0 ms-xxl-3 ${styles.textArea}`}>
            <div className={styles.profile}>
              <div className={`h4 fw-bold ${styles.color}`}>
                {userData.name}{' '}
                <div className={`${styles.color} p d-inline ps-3`}>
                  {userData.level === 1
                    ? '一般會員'
                    : userData.level === 2
                    ? '白金會員'
                    : userData.level === 3
                    ? '鑽石會員'
                    : ''}
                </div>
              </div>
              <div className={`${styles.infoTable} p mt-4 row`}>
                <div className="col-xxl-6 col-12">
                  <table className={styles.tableWidth}>
                    <tbody>
                      <tr>
                        <th>
                          暱稱<span> | nickname</span>
                        </th>
                        <td>{userData.nickname}</td>
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

                <div className="col-xxl-6 col-12">
                  <table className={`ms-0 ms-xxl-4 ${styles.tdWidth}`}>
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
          <div className={`${styles.userImg} col-xxl-3 `}>
            <Image
              width={255}
              height={255}
              className={styles.img}
              src={avatarUrl}
              alt=""
            />
          </div>
          {/* 創建時間 */}
          <div className={`${styles.timeArea} row align-items-center`}>
            <div
              className={`col-12 col-md-5 col-xxl-10 col-xl-8 col-lg-6 ${styles.timeStyle}`}
            >
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
            <div className={`${styles.editBtn} col-2 pe-2`}>
              <Link href="/user/information/update">
                <button className={`btn-primary h6 ${styles.btn}`}>編輯</button>
              </Link>
            </div>
          </div>
          <hr className={`underline ${styles.underline}`}></hr>
          <div
            className={`row ${styles['levelArea']} d-flex py-0 my-0 align-items-center`}
          >
            <div
              className={`${styles['levelFlex']}  col-12 col-xxl-10 gap-2 justify-content-evenly d-flex align-items-center`}
            >
              <Image
                src="/user/regular.svg"
                alt="user level"
                width={250}
                height={192}
                className={`${styles.levelImg}`}
              />
              <Image
                src="/user/platinum.svg"
                alt="user level"
                width={250}
                height={192}
                className={`${styles.levelImg}`}
              />
              <Image
                src="/user/diamond.svg"
                alt="user level"
                width={250}
                height={192}
                className={`${styles.levelImg}`}
              />
            </div>
          </div>
        </div>
      </UserSection>
    </>
  )
}
