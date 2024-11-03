import Header from '@/components/layout/common/header/index'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Styles from '@/components/activity/page/activity-det/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import Brands from '@/components/home/common/brands'
import Footer from '@/components/layout/common/footer-global/index'
import { PiMagnifyingGlass } from 'react-icons/pi'
import Dropdown from '@/components/shared/dropdownList/sample'
import FormToggle from '../../common/FormToggle'
import Carousel from '../../common/Carousel'
import CardCarousel2 from '@/components/product/common/product-container2'
export default function ActivityDet(props) {
  const products = [
    {
      id: 1,
      brand: 'YSL',
      name: '時尚印記唇釉',
      originalPrice: 2080,
      salePrice: 1580,
      imageUrl: '/product/NARS_ES01_M_ADULTS.webp',
      color: '#e3a790',
    },
    {
      id: 2,
      brand: 'NARS',
      name: '唇膏',
      originalPrice: 1900,
      salePrice: 1400,
      imageUrl: '/product/NARS_LS01_M_133.webp',
      color: '#732111',
    },
    {
      id: 3,
      brand: 'LANCOME',
      name: '絕對完美柔霧唇膏',
      originalPrice: 2500,
      salePrice: 2200,
      imageUrl: '/product/LANCOME_LS01_M_196.webp',
      color: '#8f352d',
    },
  ]
  const cardsData = [
    {
      title: '暮光派對1',
      subtitle: 'YSL BEAUTY LIGHT CLUB',
      imgSrc: '/activity/YSL1_1.png',
      date: '2024-11-16 ~ 2024-11-17',
      host: 'Yves Saint Laurent',
      location: '110台北市信義區市府路45號',
      attendees: '12 人',
      status: '報名中',
    },
    {
      title: '暮光派對2',
      subtitle: 'YSL BEAUTY LIGHT CLUB',
      imgSrc: '/activity/BOBBI1_1.png',
      date: '2024-11-16 ~ 2024-11-17',
      host: 'Yves Saint Laurent',
      location: '110台北市信義區市府路45號',
      attendees: '12 人',
      status: '報名中',
    },
    {
      title: '暮光派對3',
      subtitle: 'YSL BEAUTY LIGHT CLUB',
      imgSrc: '/activity/ESLD1_1.png',
      date: '2024-11-16 ~ 2024-11-17',
      host: 'Yves Saint Laurent',
      location: '110台北市信義區市府路45號',
      attendees: '12 人',
      status: '報名中',
    },
  ]
  return (
    <>
      <div>
        <div className={Styles['act-img-container']}>
          <Image
            src={'/activity/YSL4_1.png'}
            width={1920}
            height={700}
            alt="YSL4_1"
          />
        </div>
        <div className={`${Styles['sec1']} container `}>
          <p className={`${Styles['h1']} ${Styles['CHN_name']}`}>奢光派對</p>
          <p className={Styles['p']}>YSL BEAUTY LIGHT CLUB</p>
          <p className={Styles['textContent']}>
            Yves Saint Laurent Beauté 邀請您進入時尚世界，推出全新 YSL Loveshine
            唇膏系列。 2024 年 3 月 26 日星期二和 3 月 27 日星期三加入我們
            ，在免費體驗式快閃中心的中心，充滿感官動畫和許多其他驚喜，距離共和國廣場僅幾米遠體驗式快閃中心的中心，充滿感官動畫和許多其他驚喜，距離共和國廣場僅幾米遠，
          </p>
        </div>
        <div className={Styles['sec2']}>
          <Image
            src={'/activity/YSL4_2.png'}
            width={860}
            height={500}
            alt="YSL4_1"
          />
          <Image
            src={'/activity/YSL4_3.png'}
            width={800}
            height={500}
            alt="YSL4_1"
          />
        </div>
        <div className={`${Styles['sec3']} container d-flex flex-wrap`}>
          <div className={`${Styles['googleMap']} col-md-6`}>
            <Image
              src={'/activity/googleMap.png'}
              width={800}
              height={500}
              alt="google"
            />
          </div>
          <div className={`${Styles['info']} col-md-6`}>
            <div className={`${Styles['info-title']} d-flex`}>
              <p className={Styles['h4']}>活動資訊</p>
              <p
                className={Styles['h4-L']}
                style={{ color: 'rgba(144, 149, 122, 0.3)' }}
              >
                Information
              </p>
            </div>
            <div className={Styles['info-content']}>
              <p>電話：0912345678</p>
              <p>信箱：Beautique@gmail.com</p>
              <p>日期：2024/9/6 - 9/8 11:00 - 21:00</p>
              <p>
                官網：
                <a href="https://www.yslbeauty.com.tw" target="_blank">
                  https://www.yslbeauty.com.tw
                </a>
              </p>
              <p>地點：華山1914文化創意產業園區 中4A館</p>
            </div>
          </div>
        </div>
        <div className={`${Styles['sec4']} container`}>
          <div className={Styles['item']}>
            <p className={Styles['number']}>06</p>
            <p className={Styles['text']}>報名人數</p>
          </div>
          <div className={Styles['item']}>
            <p className={Styles['number']}>50</p>
            <p className={Styles['text']}>名額</p>
          </div>
          <div className={Styles['item']}>
            <p className={Styles['number']}>237</p>
            <p className={Styles['text']}>瀏覽次數</p>
          </div>
        </div>
        <div className={Styles['sec5']}>
          <FormToggle />
          <Carousel cardsData={cardsData} />
        </div>
      </div>
      <CardCarousel2 products={products} />
    </>
  )
}
