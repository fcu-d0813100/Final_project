import ProductPage from '@/components/product/common/product-upperpage';
export default function Explore({productPage}) {
  console.log("Fetched data:", productPage);
  return (
    <>
      <ProductPage productPage={productPage}/>
    </>
  );
}