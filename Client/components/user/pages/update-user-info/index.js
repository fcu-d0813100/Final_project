import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import UserSection from '@/components/user/common/user-section'
import styles from './index.module.scss'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/router'
import DeleteModal from '@/components/shared/modal-delete'
import { toast, Toaster } from 'react-hot-toast'
import PreviewUploadImage from '@/components/user/common/preview-upload-image'
import {
  countries,
  townships,
  postcodes,
} from '@/components/cart/common/tw-zipcode/data-townships'

export default function UpdateInfo({
  initPostcode = '',
  onPostcodeChange = (country, township, postcode) => {},
}) {
  const [selectedFile, setSelectedFile] = useState(null)
  const { auth, update, getUser, deleteUser } = useAuth()
  const router = useRouter()
  // 串地址
  //console.log(countries, townships, postcodes)

  // 記錄陣列的索引值，預設值是-1，相當於"請選擇xxx"
  const [countryIndex, setCountryIndex] = useState(-1)
  const [townshipIndex, setTownshipIndex] = useState(-1)

  // 郵遞區號使用字串(數字字串)
  const [postcode, setPostcode] = useState('')

  // 利用傳入時的initPostcode初始化用
  useEffect(() => {
    if (initPostcode) {
      setPostcode(initPostcode)
      // 使用initPostcode尋找對應的countryIndex, townshipIndex
      for (let i = 0; i < postcodes.length; i++) {
        for (let j = 0; j < postcodes[i].length; j++) {
          if (postcodes[i][j] === initPostcode) {
            setCountryIndex(i)
            setTownshipIndex(j)
            return // 跳出巢狀for迴圈
          }
        }
      }
    }
  }, [initPostcode])

  // 當countryIndex, townshipIndex均有值時，設定postcode值
  useEffect(() => {
    if (countryIndex > -1 && townshipIndex > -1) {
      setPostcode(postcodes[countryIndex][townshipIndex])
    }
  }, [countryIndex, townshipIndex])

  // 當使用者改變的countryIndex, townshipIndex，使用onPostcodeChange回傳至父母元件
  useEffect(() => {
    if (postcode && postcode !== initPostcode) {
      onPostcodeChange(
        countries[countryIndex],
        townships[countryIndex][townshipIndex],
        postcode
      )
    }
  }, [postcode])

  // 狀態為物件，屬性對應到表單的欄位名稱
  const [user, setUser] = useState({
    name: '',
    nickname: '',
    gender: '',
    birthday: '',
    email: '',
    img: '',
    phone: '',
    city: '',
    area: '',
    address: '',
    create_at: '',
    updated_at: 'Now()',
  })
  // 錯誤訊息狀態
  const [errors, setErrors] = useState({
    name: '',
    email: '',
  })

  // 多欄位共用事件函式
  const handleFieldChange = (e) => {
    let nextUser = { ...user, [e.target.name]: e.target.value }
    setUser(nextUser)
  }

  const handleCityChange = (e) => {
    const newCountryIndex = +e.target.value
    setCountryIndex(newCountryIndex)
    setTownshipIndex(-1)
    setPostcode('')

    if (newCountryIndex > -1) {
      setUser((prevUser) => ({
        ...prevUser,
        city: countries[newCountryIndex],
      }))
    }
  }

  const handleAreaChange = (e) => {
    const newTownshipIndex = +e.target.value
    setTownshipIndex(newTownshipIndex)

    if (newTownshipIndex > -1) {
      setUser((prevUser) => ({
        ...prevUser,
        area: townships[countryIndex][newTownshipIndex],
      }))
    }
  }

  const checkError = (user) => {
    // 表單檢查--START---
    // 1. 建立一個全新的錯誤訊息用物件
    const newErrors = {
      name: '',
      email: '',
    }

    // 2.開始作各欄位的表單檢查，如果有錯誤訊息就加到newErrors
    if (!user.name) {
      newErrors.name = '姓名為必填'
    }

    if (!user.email) {
      newErrors.email = 'Email為必填'
    }
    // 如果newErrors中的物件值中其中有一個非空白字串，代表有錯誤發生
    const hasErrors = Object.values(newErrors).some((v) => v)
    // 表單檢查--END---
    return { newErrors, hasErrors }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { newErrors, hasErrors } = checkError(user)
    // console.log('錯誤檢查:', newErrors, hasErrors)
    setErrors(newErrors)
    if (hasErrors) {
      return
    }

    try {
      // 如果有選擇檔案，執行更新頭像的動作
      if (selectedFile) {
        const resData = await update(user, selectedFile)
        // console.log('Response data:', resData)
        if (resData.status === 'success') {
          toast.success('會員頭像修改成功', {
            style: {
              padding: '12px 40px',
              color: '#626553',
              fontSize: '18px',
            },
            iconTheme: {
              primary: '#626553',
              secondary: '#fff',
            },
          })
          setTimeout(() => {
            router.push('/user')
          }, 1500)
        } else {
          // console.error('更新失敗 - 響應數據狀態錯誤:', resData.message)
          toast.error('更新失敗，請稍後再試', {
            style: {
              padding: '12px 40px',
              color: '#963827',
              fontSize: '18px',
            },
            iconTheme: {
              primary: '#963827',
              secondary: '#fff',
            },
          })
        }
      }

      // 執行用戶資料的更新
      const resData = await update(user)
      // console.log('用戶資料更新結果:', resData)
      if (resData.status === 'success') {
        toast.success('您已更新個人資料', {
          style: {
            padding: '12px 40px',
            color: '#626553',
            fontSize: '18px',
          },
          iconTheme: {
            primary: '#626553',
            secondary: '#fff',
          },
        })
        setTimeout(() => {
          router.push('/user')
        }, 1500)
      } else {
        // console.error('更新失敗 - 響應數據狀態錯誤:', resData.message)
        toast.error('更新失敗，請稍後再試', {
          style: {
            padding: '12px 40px',
            color: '#963827',
            fontSize: '18px',
          },
          iconTheme: {
            primary: '#963827',
            secondary: '#fff',
          },
        })
      }
    } catch (error) {
      // console.error('更新失敗:', error)
      toast.error('更新失敗，請稍後再試', {
        style: {
          padding: '12px 40px',
          color: '#963827',
          fontSize: '18px',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
    }
  }

  // 初始化會員資料
  const initUserData = async () => {
    const userData = await getUser()
    setUser(userData)

    // 查找對應的 countryIndex 和 townshipIndex
    let initialCountryIndex = -1
    let initialTownshipIndex = -1

    countries.forEach((country, i) => {
      if (country === userData.city) {
        initialCountryIndex = i
        townships[i].forEach((township, j) => {
          if (township === userData.area) {
            initialTownshipIndex = j
          }
        })
      }
    })

    setCountryIndex(initialCountryIndex)
    setTownshipIndex(initialTownshipIndex)

    // 設置對應的郵遞區號（如果有）
    if (initialCountryIndex > -1 && initialTownshipIndex > -1) {
      setPostcode(postcodes[initialCountryIndex][initialTownshipIndex])
    }
  }

  // 本頁一開始render後就會設定到user狀態中
  useEffect(() => {
    initUserData()
  }, [])

  const [showModal, setShowModal] = useState(false)
  const handleDeleteUser = async () => {
    try {
      toast.success('您已成功申請停權', {
        style: {
          padding: '12px 40px',
          color: '#626553',
          fontSize: '18px',
        },
        iconTheme: {
          primary: '#626553',
          secondary: '#fff',
        },
      })
      setShowModal(false) // 確保模態對話框被關閉
      await deleteUser(user.id)
      router.push('/user/information/update')
    } catch (error) {
      // console.error('刪除過程中發生錯誤:', error)
      toast.error('刪除過程中發生錯誤，請稍後再試', {
        style: {
          padding: '12px 40px',
          color: '#963827',
          fontSize: '18px',
        },
        iconTheme: {
          primary: '#963827',
          secondary: '#fff',
        },
      })
    }
  }

  const openModal = () => {
    // e.preventDefault()
    // 阻止表單提交
    setShowModal(true)
  }
  const closeModal = () => {
    setShowModal(false)
  }
  const handleCancel = () => {
    setUser(user)
    setTimeout(() => {
      router.push('/user')
    }, 2000)
  }

  return (
    <>
      <UserSection titleCN="更新資訊" titleENG="Information">
        <form
          onSubmit={handleSubmit}
          method="post"
          encType="multipart/form-data"
        >
          <div className="mt-5 container-fluid">
            <div className={`${styles['form-container']} row`}>
              <div
                className={`${styles['form-content']} col-md-9 col-12 pe-md-3 pe-0 d-flex flex-wrap`}
              >
                <div className={`col-md-4 col-6 ${styles.info} `}>
                  <label htmlFor="name" className="form-label pb-2 fw-bold ">
                    姓名 <span className=" ps pe-4 fw-bold ">| name</span>
                  </label>
                  <span className={`ps ${styles.error} `}>{errors.name}</span>{' '}
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${styles['form-control2']} `}
                    onChange={handleFieldChange}
                    value={user.name}
                  />
                </div>
                <div className={`col-md-4 col-6  ${styles.info}`}>
                  <label htmlFor="nickname" className="form-label pb-2 fw-bold">
                    暱稱 <span className="ps pe-4 fw-bold">| nickname</span>
                  </label>{' '}
                  <input
                    name="nickname"
                    onChange={handleFieldChange}
                    value={user.nickname}
                    type="text"
                    className={`form-control ${styles['form-control2']} `}
                  />
                </div>
                <div className={`col-md-4  col-6 ${styles.info} mt-md-0 mt-5 `}>
                  <label htmlFor="title " className="form-label pb-2 fw-bold">
                    稱謂 <span className=" ps pe-4 fw-bold">| title</span>
                  </label>{' '}
                  <select
                    name="gender"
                    value={user.gender}
                    onChange={handleFieldChange}
                    className={`form-select ${styles['form-select2']}`}
                  >
                    <option value=" "></option>
                    <option value="1">男士</option>
                    <option value="2">女士</option>
                  </select>
                </div>
                {/*  */}
                <div className={`col-6 col-md-3  ${styles.info} mt-5`}>
                  <label
                    htmlFor="birthday"
                    className={`form-label pb-2 fw-bold`}
                  >
                    生日 <span className=" ps pe-4 fw-bold">| birthday</span>
                  </label>{' '}
                  <input
                    value={user.birthday}
                    type="date"
                    className={`form-control ${styles['form-control2']} `}
                    name="birthday"
                    onChange={handleFieldChange}
                  />
                </div>
                <div className={`col-12 col-md-3 ${styles.info} mt-5`}>
                  <label htmlFor="phone" className="form-label pb-2 fw-bold">
                    手機 <span className=" ps pe-4 fw-bold">| phone</span>
                  </label>{' '}
                  <input
                    value={user.phone}
                    onChange={handleFieldChange}
                    type="text"
                    className={`form-control ${styles['form-control2']} `}
                    pattern="\d{10}"
                    name="phone"
                  />
                </div>
                <div className={`col-md-6 col-12 ${styles.info} mt-5`}>
                  <label htmlFor="email" className="form-label pb-2 fw-bold">
                    信箱 <span className=" ps pe-5 fw-bold">| email</span>
                  </label>{' '}
                  <span className={`ps ${styles.error} `}>{errors.email}</span>
                  <input
                    value={user.email}
                    onChange={handleFieldChange}
                    type="email"
                    className={`form-control ${styles['form-control2']} `}
                    name="email"
                  />
                </div>
              </div>

              <div className={`${styles['avatar-area']}  col-0 col-md-3  `}>
                {/* <div className={`${styles['avatar']} ratio ratio-1x1 w-75`}> */}
                <PreviewUploadImage
                  userId={user.id}
                  avatar={
                    user.img ? `http://localhost:3005/avatar/${user.img}` : ''
                  }
                  avatarBaseUrl="http://localhost:3005/avatar"
                  defaultImg="avatar01.jpg"
                  setSelectedFile={setSelectedFile}
                  selectedFile={selectedFile}
                  photoUrl={user.photo_url}
                />
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* 收件資訊 */}
          <div
            className={`row ${styles['address-line']} d-flex align-items-center pb-3 my-5`}
          >
            <h3 className={`h4 ${styles['center-title']} pb-2`}>收件資訊</h3>
          </div>
          <div
            className={`d-flex row ${styles['address-line']} ${styles['address-area']} align-items-center justify-content-start p-0 m-0`}
          >
            <div
              className={`col-6 col-md-3 ${styles.info} ${styles['address-margin']}`}
            >
              <label htmlFor="city" className={`form-label pb-2 fw-bold`}>
                縣市
                <span className={`ps fw-bold ${styles['info-address']}`}>
                  | city
                </span>
              </label>{' '}
              <select
                name="city"
                value={countryIndex}
                onChange={handleCityChange}
                className={`form-select ${styles['form-select2']}`}
              >
                <option value="-1">選擇縣市</option>
                {countries.map((value, index) => (
                  <option key={index} value={index}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div
              className={`col-6 col-md-3 ${styles.info} ${styles['address-margin']}`}
            >
              <label htmlFor="area" className={`form-label pb-2 fw-bold`}>
                區域
                <span className={`ps fw-bold ${styles['info-address']}`}>
                  | area
                </span>
              </label>{' '}
              <select
                name="area"
                value={townshipIndex}
                onChange={handleAreaChange}
                className={`form-select ${styles['form-select2']}`}
              >
                <option value="-1">選擇區域</option>
                {countryIndex > -1 &&
                  townships[countryIndex].map((value, index) => (
                    <option key={index} value={index}>
                      {value}
                    </option>
                  ))}
              </select>
            </div>
            <div
              className={`col-12 col-md-6 ${styles.info} ${styles['address-margin']}`}
            >
              <label htmlFor="address" className={`form-label pb-2 fw-bold`}>
                地址
                <span className={`ps ${styles['info-address']} fw-bold`}>
                  | address
                </span>
              </label>{' '}
              <input
                type="text"
                className={`form-control ${styles['form-control2']}`}
                name="address"
                placeholder="請輸入完整地址"
                value={user.address}
                onChange={handleFieldChange}
              />
            </div>
          </div>

          {/* 注意事項與提交按鈕 */}
          <div
            className={`row d-flex justify-content-between align-items-center mt-3`}
          >
            <div className={`col-12 col-md-6`}>
              <p className={`ps ${styles.explain}`}>
                ※請填寫完整的個人資訊，以享有更多會員權益。
              </p>
            </div>
            <div
              className={`col-12 col-md-3 pe-3 mt-3 mt-md-0 d-flex justify-content-end align-items-center`}
            >
              <button
                type="button"
                onClick={openModal}
                className={` ${styles['delete-account']}`}
              >
                {' '}
                停用會員帳戶{' '}
              </button>{' '}
              <DeleteModal
                title="您確定要停用帳戶嗎 ?"
                content="停用帳戶後，您將無法登入及享有會員權益，如需恢復帳戶，請聯繫客服以重新啟用。"
                btnConfirm="停用帳戶"
                btnCancel="取消"
                ConfirmFn={handleDeleteUser}
                show={showModal}
                handleClose={closeModal}
              />
            </div>
          </div>

          <div className={`${styles['submit-area']} row`}>
            <button
              type="button"
              className={`btn-secondary h6 me-3 me-sm-4 ${styles['cancel-btn']}`}
              onClick={handleCancel}
            >
              取消
            </button>
            <button
              type="submit"
              className={`btn-primary h6 ${styles['cancel-btn']}`}
            >
              儲存
            </button>
          </div>
        </form>
      </UserSection>
    </>
  )
}
