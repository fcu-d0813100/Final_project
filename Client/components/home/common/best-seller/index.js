import Image from 'next/image'
import Styles from '@/components/home/common/best-seller/index.module.scss'
import 'bootstrap/dist/css/bootstrap.min.css'

// import PlaceholderText from '@/components/eddy_item/common/placeholder-text'

export default function Home() {
  return (
    <>
      {/* Main Content */}
      <main>
        {/* BestSeller*/}
        <div>
          <div className={`${Styles['home-bestSeller']} ${Styles['body']}`}>
            <Image
              src={'/activity/homeMainPic.png'}
              width={1920}
              height={549}
              alt=""
              className={Styles['bestSeller-bgi-pc']}
            />
            <Image
              src={'/activity/mobileBgi.png'}
              width={300}
              height={400}
              alt=""
              className={Styles['bestSeller-bgi-mobile']}
            />
            <p className={Styles['bestSeller-brand']}>NARS</p>
            <p className={`${Styles['bestSeller-text']} ${Styles['h1-L']}`}>
              Best Seller
            </p>

            <p className={`${Styles['bestSeller-slogan']} ${Styles['h3']}`}>
              經典豆沙紅｜百搭色號 永不出錯
            </p>
            <div className={`${Styles['bestSeller-card']} d-flex`}>
              <div className={Styles['card1']}>
                <Image
                  src={'/activity/bestSellerPic.png'}
                  width={300}
                  height={400}
                  alt=""
                />
                <p className={Styles['card-brand']}>NARS</p>
                <p>特霧絲柔持色唇膏</p>
                <button
                  className={`${Styles['btn-danger']} ${Styles['btn-pc']}`}
                >
                  查看商品
                </button>
              </div>
              <div className={Styles['card2']}>
                <Image
                  src={'/activity/bestSellerPic.png'}
                  width={300}
                  height={400}
                  alt=""
                />
                <p>NARS</p>
                <p>特霧絲柔持色唇膏</p>
                <button
                  className={`${Styles['btn-danger']} ${Styles['btn-pc']}`}
                >
                  查看商品
                </button>
              </div>
            </div>
          </div>
          <button className={`${Styles['btn-danger']} ${Styles['btn-mobile']}`}>
            查看商品
          </button>
        </div>
      </main>
    </>
  )
}
