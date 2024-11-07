// pages/card-home/index.js
import React from 'react'
import ProductCardContainer1 from '@/components/product/common/product-container1'
import ProductCardContainer2 from '@/components/product/common/product-container2'

const products = [
  {
    brand: 'YSL',
    name: '時尚印記啞光唇釉',
    originalPrice: 2080,
    salePrice: 1580,
    imageUrl: '/product/NARS_ES01_M_ADULTS.webp',
    color: '#e3a790',
  },
  {
    brand: 'NARS',
    name: '唇膏',
    originalPrice: 1900,
    salePrice: 1400,
    imageUrl: '/product/NARS_LS01_M_133.webp',
    color: '#732111',
  },
  {
    brand: 'LANCOME',
    name: '絕對完美柔霧唇膏',
    originalPrice: 2500,
    salePrice: 2200,
    imageUrl: '/product/LANCOME_LS01_M_196.webp',
    color: '#8f352d',
  },
  {
    id: 1,
    brand: 'YSL',
    name: '時尚印記啞光唇釉',
    originalPrice: 2080,
    salePrice: 1580,
    imageUrl: '/product/NARS_ES01_M_ADULTS.webp',
    color: '#e3a790',
  },
  {
    id: 2,
    brand: 'YSL',
    name: '時尚印記啞光唇釉',
    originalPrice: 2080,
    salePrice: 1580,
    imageUrl: '/product/NARS_ES01_M_ADULTS.webp',
    color: '#e3a790',
  },
  {
    id: 3,
    brand: 'NARS',
    name: '唇膏',
    originalPrice: 1900,
    salePrice: 1400,
    imageUrl: '/product/NARS_LS01_M_133.webp',
    color: '#732111',
  },
  {
    id: 4,
    brand: 'LANCOME',
    name: '絕對完美柔霧唇膏',
    originalPrice: 2500,
    salePrice: 2200,
    imageUrl: '/product/LANCOME_LS01_M_196.webp',
    color: '#8f352d',
  },
  {
    id: 5,
    brand: 'YSL',
    name: '時尚印記啞光唇釉',
    originalPrice: 2080,
    salePrice: 1580,
    imageUrl: '/product/NARS_ES01_M_ADULTS.webp',
    color: '#e3a790',
  },
  // 可以繼續添加其他商品
]

const CardHomePage = () => {
  return (
    <div>
      <ProductCardContainer1 products={products} />
      <hr />
      <ProductCardContainer2 products={products} />
    </div>
  )
}

export default CardHomePage
