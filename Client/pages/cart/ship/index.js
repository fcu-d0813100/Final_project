import { useShip711StoreOpener } from '@/hooks/use-ship-711-store'
import style from '@/pages/cart/ship/ship.module.scss'

export default function Seven() {
  // useShip711StoreOpener的第一個傳入參數是"伺服器7-11運送商店用Callback路由網址"
  // 指的是node(express)的對應api路由。詳情請見說明文件:
  const { store711, openWindow, closeWindow } = useShip711StoreOpener(
    'http://localhost:3005/api/shipment/711',
    { autoCloseMins: 3 } // x分鐘沒完成選擇會自動關閉，預設5分鐘。
  )

  return (
    <>
      <p>
        <br />
        <button
          className={style.button}
          onClick={() => {
            openWindow()
          }}
        >
          選擇門市
        </button>
        <div className={style.text}>
          <span> 門市名稱 : </span>
          <span className={style.title}>{store711.storename}</span>
        </div>
        <div>
          <span> 門市地址 : </span>
          <span className={style.title}>{store711.storeaddress}</span>
        </div>
      </p>
      {/* <p>{JSON.stringify(store711)}</p> */}
    </>
  )
}
