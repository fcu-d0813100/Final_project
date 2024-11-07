// pages/card-home/index.js
import React from 'react'
import ProductPage from '@/components/product/common/product-list'

const products = [
  {
    name: 'YSL <br> 時尚印記唇釉',
    originalPrice: 2080,
    salePrice: 1580,
    imageUrl: './imgs/NARS_ES01_M_ADULTS.webp',
    color: '#e3a790',
  },
  {
    name: 'NARS <br> 唇膏',
    originalPrice: 1900,
    salePrice: 1400,
    imageUrl: './imgs/NARS_LS01_M_133 (1).webp',
    color: '#732111',
  },
  {
    name: 'LANCOME <br> 絕對完美柔霧唇膏',
    originalPrice: 2500,
    salePrice: 2200,
    imageUrl: './imgs/LANCOME_LS01_M_196.webp',
    color: '#8f352d',
  },
]

const ProductList = () => {
  return (
    <div>
      <ProductPage products={products} />
    </div>
  )
}

export default ProductList
