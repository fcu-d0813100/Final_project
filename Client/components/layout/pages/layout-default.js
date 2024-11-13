import Header from '../common/header'
import Footer from '../common/footer-global'
import { useCartProduct } from '@/hooks/use-cartP'
import { useCartWorkshop } from '@/hooks/use-cartW'

export default function LayoutDefault({ children }) {
  // 購物車商品數量
  const { productItems = [] } = useCartProduct()
  const { workshopItems = [] } = useCartWorkshop()
  let cartitems = productItems.length + workshopItems.length

  return (
    <>
      <Header cartitems={cartitems} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
