import React, { useState } from 'react'
import Link from 'next/link'
import 'bootstrap/dist/css/bootstrap.min.css'
import Styles from './index.module.scss'
import AdminSB from '@/components/admin/common/admin-side-bar'
import UserTitle from '@/components/user/common/user-title'
import Image from 'next/image'

export default function Index(props) {
  const [images, setImages] = useState([]) // 存储多张图片

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files) // 转换成数组以支持多文件
    const newImages = []

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        newImages.push(reader.result)
        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]) // 添加到已有的图片中
        }
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <>
      <header
        className={`${Styles.header} d-flex justify-content-between align-items-center px-5`}
      >
        <div className="h3-L">Beautique</div>
        <div className="h5">Admin</div>
      </header>
      <div className={Styles['user-section']}>
        <AdminSB />
        <div className={Styles['any-section']}>
          <UserTitle CN="活動上架" ENG="New activity" />
          <form className={`${Styles['form-container']} mt-5`}>
            <div className="row align-items-md-stretch">
              <div className="col-md-6">
                <div className={Styles['form-image']}>
                  {images.length > 0 ? (
                    <div className={Styles['image-preview-container']}>
                      {images.map((image, index) => (
                        <div key={index} className={Styles['image-preview']}>
                          <Image
                            src={image}
                            width={800}
                            height={300}
                            alt={`活動圖片 ${index + 1}`}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={Styles['placeholder']}></div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={Styles['upload-input']}
                    style={{ display: 'none' }}
                    id="image-upload"
                    multiple
                  />
                  <label
                    htmlFor="image-upload"
                    className={Styles['upload-button']}
                  >
                    圖片上傳
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className={Styles['form-content']}>
                  <h2>主要資訊</h2>
                  <div className={Styles['form-group']}>
                    <div className="row">
                      <div className="col-lg-8">
                        <label htmlFor="event-name">活動名稱 | name</label>
                        <input
                          type="text"
                          id="event-name"
                          placeholder="A07 週年慶登記"
                          className="form-control"
                        />
                      </div>
                      <div className="col-lg-4">
                        <label htmlFor="event-quota">活動名額 | quota</label>
                        <input
                          type="number"
                          id="event-quota"
                          placeholder={1}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className={Styles['form-group']}>
                      <div className="row">
                        <div className="col-lg-4">
                          <label htmlFor="event-type">活動品牌 | type</label>
                          <input
                            type="text"
                            id="event-type"
                            placeholder="YSL"
                            className="form-control"
                          />
                        </div>
                        <div className="col-lg-8">
                          <label htmlFor="event-address">
                            活動地點 | address
                          </label>
                          <input
                            type="text"
                            id="event-address"
                            placeholder="台北市大同區重慶北路三段43號3樓"
                            className="form-control"
                          />
                        </div>
                      </div>
                    </div>

                    <div className={Styles['form-group']}>
                      <label htmlFor="event-start">
                        活動時期 | registration period
                      </label>
                      <div className="row">
                        <div className="col-lg-5">
                          <input
                            type="date"
                            id="event-start"
                            className="form-control w-100"
                          />
                        </div>
                        <div className="col-lg-2 d-flex align-items-center justify-content-center">
                          <span> ---- </span>
                        </div>
                        <div className="col-lg-5">
                          <input
                            type="date"
                            id="event-end"
                            className="form-control w-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="py-3 mb-4 bg-body-tertiary rounded-3 mt-2">
              <div className="container-fluid">
                <div className={Styles['form-group']}>
                  <label htmlFor="event-description" className="mb-2">
                    活動簡介
                  </label>
                  <textarea
                    id="event-description"
                    rows="5"
                    placeholder="活動描述..."
                    className="form-control w-100"
                  ></textarea>
                </div>
              </div>
            </div>
            <hr />
            <div className={Styles['form-actions']}>
              <Link href="/admin/activity">
                <button type="button" className={Styles['cancel-button']}>
                  取消
                </button>
              </Link>
              <button type="submit" className={Styles['submit-button']}>
                上架
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
