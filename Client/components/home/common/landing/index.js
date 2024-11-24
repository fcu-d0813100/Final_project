import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import styles from './index.module.scss'
import Image from 'next/image'
import { BsArrowRight } from 'react-icons/bs'

const LandingPage = () => {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [hasSeenAnimation, setHasSeenAnimation] = useState(false) // 用來記錄是否已經看過動畫
  const router = useRouter()

  // 檢查 sessionStorage 中是否有動畫已觀看的標記
  useEffect(() => {
    const seenAnimation = sessionStorage.getItem('hasSeenAnimation')
    const visitedLanding = sessionStorage.getItem('hasVisitedLanding')

    if (seenAnimation || visitedLanding) {
      // 如果標記存在，直接跳轉到首頁，不顯示動畫頁面
      router.push('/')
    } else {
      // 如果沒有標記，顯示動畫
      setHasSeenAnimation(true)
    }

    // 監聽頁面關閉事件，關閉頁面時清除標記
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('hasSeenAnimation')
      sessionStorage.removeItem('hasVisitedLanding')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [router])

  // 動畫完成後顯示按鈕
  const handleAnimationComplete = () => {
    setIsButtonVisible(true)
  }

  // 用戶點擊按鈕後，將標記設置為已觀看動畫，然後跳轉到首頁
  const handleButtonClick = () => {
    sessionStorage.setItem('hasSeenAnimation', 'true') // 設置動畫已看過標記
    sessionStorage.setItem('hasVisitedLanding', 'true') // 設置已訪問過 landing 頁面標記
    router.push('/') // 跳轉到首頁
  }

  // 如果還沒有顯示過動畫，那就返回 null，不渲染
  if (!hasSeenAnimation) {
    return null // 保證只有當動畫標記不存在時才渲染此頁面
  }

  return (
    <div className="landing-container">
      {/* 進場動畫 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        onAnimationComplete={handleAnimationComplete}
        className="intro-text"
      >
        {/* 圖片容器 */}
        <div className="">
          <Image
            className={styles.img}
            src="/discount/banner.svg" // 圖片路徑
            alt="Discount image" // 圖片描述
            layout="fill" // 確保圖像填滿整個容器
            objectFit="cover" // 按比例填充容器並裁剪多餘部分
            priority={true} // 優先加載圖片
          />

          {/* 黑色透明遮罩 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.2)', // 黑色透明遮罩
            }}
          ></div>

          {/* 標題和按鈕容器 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }} // 設置延遲讓它們逐漸顯現
            className={`${styles.title} flex-column justify-content-center align-content-center h-100 w-100 text-center`}
          >
            <div className="mb-5 pb-5">
              <div className={`${styles.name} h1-L`}>Beautique</div>
              <div className={`${styles.sutitle} h3-L`}>
                Where Beauty Meets Unique .
              </div>
            </div>

            {/* 按鈕 */}
            {isButtonVisible && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }} // 控制按鈕顯示的延遲
                className={`${styles.homeBtn} btn h5 enter-button d-flex justify-content-center align-items-center`}
                onClick={handleButtonClick}
              >
                SHOW NOW <BsArrowRight className={styles.right} size={30} />
              </motion.button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default LandingPage
