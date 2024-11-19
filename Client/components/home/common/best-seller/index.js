import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';  // 使用 swiper 7 的 Swiper 和 SwiperSlide
import 'swiper/css';  // 引入 swiper 7 的基本樣式
import { Autoplay } from 'swiper';  // 引入 Autoplay 模塊
import BestSellerCart from '@/components/home/common/best-seller-common'; // 引入 BestSellerCart 組件
import styles from './index.module.scss'; // 確保引入正確的樣式

const Index = () => {
  const slides = [
    {
      title: "經典豆沙紅｜百搭色號 永不出錯",
      bgc: "#90957a",
      bgimg: "NarsHome.svg",
      mainimage1: "NARS_LS01_M_135.webp",
      pd_id1:109,
      brand: "NARS",
      product_name: "特霧絲柔持色唇膏",
      mainimage2: "NARS_LS01_M_101.webp",
      pd_id2:105,
    },
    {
      title: "上妝輕盈無妝　感持妝無負擔",
      bgc: "#EFE6DD",
      bgimg: "EsteeLauderHome.svg",
      mainimage1: "ESTEE_LF01_M_1C0.webp",
      pd_id1:120,
      brand: "Estee Lauder",
      product_name: "粉持久完美持妝粉底 ",
      mainimage2: "ESTEE_LF01_M_2W2.webp",
      pd_id2:124,
    },
    {
      title: "復古烈火紅｜內斂高級 誘惑撩撥",
      bgc: "#652303",
      bgimg: "yslHome.svg",
      mainimage1: "YSL_LS04_M_38.webp",
      pd_id1:247,
      brand: "YSL",
      product_name: "奢華緞面絲絨唇膏",
      mainimage2: "YSL_LS04_M_36.webp",
      pd_id2:250,
    },
    {
      title: "絲滑舒適　滋潤卻不黏膩",
      bgc: "#FEF3EE",
      bgimg: "bbHome.svg",
      mainimage1: "BOBBI_LG01_M_760.webp",
      pd_id1:68,
      brand: "Bobbi Brown",
      product_name: "晶鑽桂馥修護潤唇精華 ",
      mainimage2: "BOBBI_LG01_M_755.webp",
      pd_id2:66,
    }
    // 可以根據需要添加其他幻燈片
  ];

  return (
    <Swiper className={styles.bsSlide}
      modules={[Autoplay]}  // 使用 Autoplay 模塊
      spaceBetween={0}  // 幻燈片之間的距離
      slidesPerView={1}  // 每次顯示一個幻燈片
      loop={true}  // 啟用循環
      autoplay={{
        delay: 3000,  // 每個幻燈片顯示 3000 毫秒
        disableOnInteraction: false,  // 用戶交互後繼續自動播放
      }}
      speed={1000}  // 幻燈片切換速度
      onSlideChange={() => console.log('slide changed')}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <BestSellerCart
            title={slide.title}
            bgc={slide.bgc}
            bgimg={slide.bgimg}
            mainimage1={slide.mainimage1}
            brand={slide.brand}
            product_name={slide.product_name}
            mainimage2={slide.mainimage2}
            pd_id1={slide.pd_id1}
            pd_id2={slide.pd_id2}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Index;