// components/Explore.js
import UserSection from '@/components/user/common/user-section';
import styles from "./index.module.scss";
import { useFavorite } from '@/hooks/use-favorite';
import { useCartProduct } from '@/hooks/use-cartP';
import Image from 'next/image';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Explore() {
  const { favoriteProducts, handleFavoriteClick, favoritesList } = useFavorite(); // 使用收藏鉤子取得收藏清單
  const { onAddProductMany } = useCartProduct();

  const addPnotify = () =>
    toast.success('新增1件商品', {
      style: { border: '1.2px solid #90957a', padding: '12px 40px', color: '#626553' },
      iconTheme: { primary: '#626553', secondary: '#fff' },
    });

  return (
    <>
      <UserSection titleCN="收藏清單" titleENG="favorite">
        <div className={`${styles['row']} ${styles['product-card-container']}`} id="product-card-container">
          {favoritesList.map((product) => (
            <div
              key={product.color_id}
              className={`${styles['product-card-w']} col-6 col-md-4 col-lg-3 text-center mb-5`}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles['info']}>
                <div className={`${styles['product-new-w']} d-inline-block p5`}>NEW</div>
                <div className={`${styles['product-sale-w']} d-inline-block p5`}>SALE</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavoriteClick(product);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }}
              >
                {favoriteProducts[product.color_id] ? <FaHeart color="#973929" size={24} /> : <FaRegHeart size={24} />}
              </button>
              <Image
                width={200}
                height={200}
                src={`/product/mainimage/${product.mainimage}`}
                className={styles['product-cardimg-w']}
                alt={product.product_name}
              />
              <div className={styles['product-cardbody-w']}>
                <h5 className={`${styles['product-cardtitle-w']} p`}>{product.brand}</h5>
                <h5 className={`${styles['product-cardtitle-w']} p`}>{product.product_name}</h5>
                <span className={`${styles['product-price-w']} h6`} style={{ color: '#973929' }}>
                  <del style={{ color: '#90957a' }} className="h6-del">NT${product.originalprice}</del> NT${product.price}
                </span>
                <div className={styles['product-colorsquares-w']}>
                  <div className={styles['product-colorbox-w']} style={{ backgroundColor: product.color }}></div>
                </div>
                <button
                  className={`${styles['add-to-cart']} p btn-primary`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddProductMany(product);
                    addPnotify();
                  }}
                >
                  加入購物車
                </button>
              </div>
            </div>
          ))}
        </div>
      </UserSection>
    </>
  );
}
