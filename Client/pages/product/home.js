// pages/index.jsx
import React from 'react';
import ProductContainer from '../../components/product/homeproductlist.js';

const products = [
  {
    name: 'YSL <br> 時尚印記啞光唇釉',
    originalPrice: 2080,
    salePrice: 1580,
    imageUrl: '/imgs/NARS_ES01_M_ADULTS.webp',
    color: '#e3a790'
  },
  {
    name: 'NARS <br> 唇膏',
    originalPrice: 1900,
    salePrice: 1400,
    imageUrl: '/imgs/NARS_LS01_M_133 (1).webp',
    color: '#732111'
  },
  {
    name: 'LANCOME <br> 絕對完美柔霧唇膏',
    originalPrice: 2500,
    salePrice: 2200,
    imageUrl: '/imgs/LANCOME_LS01_M_196.webp',
    color: '#8f352d'
  },
  // 可以繼續添加其他商品
];

const HomePage = () => (
  <>
    <ProductContainer title="新品上市" subtitle="New Arrival" products={products} isPopular={false} />
    <hr />
    <ProductContainer title="最佳人氣" subtitle="Most Popular" products={products} isPopular={true} />
  </>
);

export default HomePage;
