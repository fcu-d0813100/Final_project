import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.scss';
import Modal from './modal'; // 引入 Modal 組件
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/router';
import ModalConfirm from '@/components/shared/modal-confirm'
import toast, { Toaster } from 'react-hot-toast';

const WheelOfFortune = () => {
  const [spinning, setSpinning] = useState(false); // 控制轉盤是否在旋轉
  const [coupon, setCoupon] = useState(null); // 存儲獲得的優惠券
  const [showModal, setShowModal] = useState(false); // 控制 modal 顯示與隱藏
  const { auth } = useAuth(); // 假設 useAuth hook 會提供用戶的認證狀態
  const [hasPlayedToday, setHasPlayedToday] = useState(false); // 是否已經玩過
  const [playHistory, setPlayHistory] = useState([]); // 儲存遊玩歷史
  const [historyVisible, setHistoryVisible] = useState(false); // 控制遊玩歷史顯示或隱藏
  const [autoRotating, setAutoRotating] = useState(true); // 控制是否啟動自動旋轉
  const wheelRef = useRef(null); // 用於引用轉盤 DOM 元素
  const autoRotateIntervalRef = useRef(null); // 用來管理自動旋轉的 interval
  const router = useRouter();


  // 優惠券項目
  const coupons = [
    { discount_value: 0.9, code: 'R1s2T3u4', coupon_id: 43 },
    { discount_value: 0.8, code: 'QA3yJ9j5', coupon_id: 42 },
    { discount_value: 100, code: 'CBAScMqr', coupon_id: 41 },
    { discount_value: 0.95, code: 'xJrbBMhW', coupon_id: 40 },
    { discount_value: 50, code: 'N7o8P9q0', coupon_id: 39 },
    { discount_value: 0.85, code: 'G7h8I9j0', coupon_id: 38 },
  ];

  // 檢查用戶是否已登入，並顯示歷史紀錄
  useEffect(() => {
    if (auth.isAuth && auth.userData.identity==='user') {
      const history = localStorage.getItem('playHistory');
      const parsedHistory = history ? JSON.parse(history) : [];
      setPlayHistory(parsedHistory);
    } else {
      setPlayHistory([]);
    }
  }, [auth.isAuth,auth.userData.identity]);

  // 自動旋轉轉盤 (只在 autoRotating 狀態為 true 時才會啟動)
  useEffect(() => {
    if (autoRotating) {
      let rotationDegree = 0; // 開始時從 0deg 開始

      // 自動旋轉邏輯
      autoRotateIntervalRef.current = setInterval(() => {
        if (wheelRef.current) {
          wheelRef.current.style.transition = 'transform 0.1s linear'; // 平滑過渡

          // 更新旋轉角度，每次增加 1 度
          rotationDegree += 1;

          // 當旋轉到 360deg 時，重置為 0deg
          if (rotationDegree >= 360) {
            rotationDegree = 0; // 旋轉到 360 後重置
          }

          // 更新轉盤的 transform 屬性
          wheelRef.current.style.transform = `rotate(${rotationDegree}deg)`;
        }
      }, 100); // 每 100 毫秒旋轉 1 度
    }

    // 清理 interval 設置
    return () => {
      if (autoRotateIntervalRef.current) {
        clearInterval(autoRotateIntervalRef.current); // 清除定時器
      }
    };
  }, [autoRotating]); // 當 autoRotating 改變時重新執行

  // 啟動轉盤旋轉
  const spinWheel = () => {
    if (spinning) return; // 如果轉盤正在旋轉，禁止重複點擊

    // 檢查用戶是否已登入
    if (!auth.isAuth || auth.userData.identity!=='user') {
      // 如果用戶未登入，顯示登入提示 Modal
      setShowModal(true);
      return; // 停止執行，避免未登入的用戶進行旋轉
    }


    // 檢查用戶今天是否已經玩過遊戲
    const today = new Date().toISOString().slice(0, 10); // 取得今天的日期（YYYY-MM-DD）
    const lastPlayedDate = localStorage.getItem('lastPlayedDate'); // 讀取 localStorage 中的最後遊玩日期

    if (lastPlayedDate === today) {
      toast.error('每天只能玩一次喔!', {
        style: {
          border: '1.2px solid #963827',
          padding: '12px 40px',
          color: '#963827',
        }, iconTheme: {
          primary: '#963827',
          secondary: '#fff'
        }
      });
      router.push('/discount'); // 跳轉到首頁
      return; // 如果今天已經玩過，則停止執行
    }

    setSpinning(true); // 開始旋轉

    // 停止自動旋轉
    if (autoRotateIntervalRef.current) {
      clearInterval(autoRotateIntervalRef.current); // 停止自動旋轉
    }

    // 隨機生成旋轉角度，確保每次旋轉不同
    const randomDegree = Math.floor(Math.random() * 360 + 3600); // 隨機角度，最少 10 圈

    // 計算最終的角度，只考慮旋轉後的 360 度範圍
    const finalDegree = randomDegree % 360;

    // 設置過渡效果，並開始動畫
    const wheel = document.getElementById('wheel');

    // 首先重置旋轉角度，避免每次旋轉基於之前的旋轉角度
    wheel.style.transition = 'none';  // 禁用過渡效果
    wheel.style.transform = `rotate(0deg)`; // 立即將轉盤重置到 0 度

    // 強制重繪 DOM，確保轉盤已經重置
    wheel.offsetHeight; // 這行代碼強制瀏覽器重繪轉盤，從而避免動畫不被重置

    // 設置過渡效果，並開始動畫
    setTimeout(() => {
      wheel.style.transition = 'transform 2s ease-out'; // 設置 2 秒的旋轉動畫
      wheel.style.transform = `rotate(${randomDegree}deg)`; // 使用正數確保順時針旋轉
    }, 50); // 確保樣式的重設完成後才開始動畫

    // 停止後顯示結果
    setTimeout(() => {
      setSpinning(false);

      // 根據 finalDegree 確定最終對應的區域
      let couponIndex = Math.floor(finalDegree / 60); // 每個區域的範圍為 60 度，根據 finalDegree 來確定位置

      if (finalDegree === 0) {
        couponIndex = coupons.length - 1; // 確保 0 度映射到最後一個區域
      }

      const selectedCoupon = coupons[couponIndex]; // 設置獲得的優惠券
      setCoupon(selectedCoupon); // 更新獲得的優惠券

      // 將此次遊玩結果添加到歷史記錄中
      const newHistory = [
        ...playHistory,
        {
          coupon: selectedCoupon,
          date: new Date().toISOString().slice(0, 10),
        },
      ];

      setPlayHistory(newHistory);
      localStorage.setItem('playHistory', JSON.stringify(newHistory));

      // 延遲顯示 Modal（你可以根據需要調整延遲時間）
      setTimeout(() => {
        setShowModal(true); // 顯示 modal
      }, 1000); // 延遲 3 秒再顯示 modal

      // 更新 localStorage，記錄用戶今天已經玩過
      localStorage.setItem('lastPlayedDate', today);
      setHasPlayedToday(true);
    }, 2000); // 動畫完成後顯示結果
  };

  // 重新啟動自動旋轉
  const restartAutoRotation = () => {
    setAutoRotating(true); // 啟動自動旋轉
  };

  // 關閉 modal 並重新啟動自動旋轉
  const closeModal = () => {
    setShowModal(false);
    restartAutoRotation(); // 在 modal 關閉後啟動自動旋轉
  };

  // 切換顯示/隱藏歷史紀錄
  const toggleHistory = () => {
    setHistoryVisible(!historyVisible);
  };

  return (
    <div className={styles.container}>
      <div className={`h1-L ${styles.title} text-center`}>Discount Carousel</div>
      <div className={`h1-L ${styles.content} text-center`}>每人每日可玩1次</div>
      <div className={styles.wheelWrapper}>
        <div
          id="wheel"
          ref={wheelRef}
          className={`${styles.wheel} ${spinning ? styles.spinning : ''}`}
        >
          {coupons.map((coupon, index) => (
            <div key={index} className={styles.segment}>
              <span className={styles.couponText}>
                {coupon.discount_value > 1
                  ? `折 ${coupon.discount_value}元`
                  : `${((1 - coupon.discount_value) * 100).toFixed(0)}% OFF`}
              </span>
            </div>
          ))}
        </div>
        <div className={styles.pointer}></div>

        <div className={`${styles.spinButton} h3-L`}>
          <button onClick={spinWheel} disabled={spinning}>
            GO
          </button>
        </div>
      </div>

      {showModal && <Modal coupon={coupon} onClose={closeModal} />}

      {auth.isAuth && auth.userData.identity==='user' && (
        <div className={styles.historyButtonWrapper}>
          <button className={`${styles.historyButton} h5`} onClick={toggleHistory}>
            {historyVisible ? '隱藏遊玩歷史' : '顯示遊玩歷史'}
          </button>
        </div>
      )}

      {historyVisible && (
        <div className={styles.history}>
          <h4>遊玩歷史</h4>
          <ul>
            {playHistory.map((entry, index) => (
              <li className="h6 py-1" key={index}>
                {entry.date}: {entry.coupon.code} -
                {entry.coupon.discount_value > 1
                  ? `折 ${entry.coupon.discount_value}元`
                  : `${((1 - entry.coupon.discount_value) * 100).toFixed(0)}% OFF`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {
        !auth.isAuth || auth.userData.identity!=='user' && showModal && (
          <ModalConfirm
            title="尚未登入會員"
            content={`是否前往登入?`}
            btnConfirm="前往登入"
            ConfirmFn={() => {
              router.push('/user/login/user')
            }}
            show={showModal}
            handleClose={() => setShowModal(false)}
          />
        )
      }
    </div>
  );
};
<Toaster />

export default WheelOfFortune;
