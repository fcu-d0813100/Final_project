import Header from '../common/header'
import Footer from '../common/footer-global'
import { useState, useEffect } from 'react'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'

export default function LayoutDefault({ children }) {
  // 購物車商品數量
  const { pCartItems = 0 } = useCartProduct()
  const { wCartItems = 0 } = useCartWorkshop()
  const [cartitems, setCartitems] = useState(0)

  useEffect(() => {
    setCartitems(pCartItems + wCartItems)
  }, [pCartItems, wCartItems])

  return (
    <>
      <Header cartitems={cartitems} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
