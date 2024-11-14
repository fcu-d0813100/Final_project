// import { useRouter } from 'next/router';
// import Comment from '@/components/product/pages/comment';

// export default function Explore(props) {
//   const router = useRouter();
  
//   // 從 router.query 中取得商品資訊
//   const { productId, colorId, productName, brand, color, imageSrc } = router.query;

//   return (
//     <>
//       {/* 傳遞商品資訊給 Comment 組件 */}
//       <Comment 
//         productId={productId} 
//         colorId={colorId} 
//         productName={productName} 
//         brand={brand} 
//         color={color} 
//         imageSrc={imageSrc} 
//       />
//     </>
//   );
// }

import UserSection from '@/components/user/common/user-section';
import { useRouter } from 'next/router';
import CommentForm from '@/components/product/common/comment';

export default function Explore(props) {
    const router = useRouter();
    const { productId, colorId, productName, brand, color, imageSrc } = router.query;

    console.log("Router Query Params:", router.query);

    return (
        <UserSection titleCN="商品評論" titleENG="Comment">
            <CommentForm 
                productId={productId} 
                colorId={colorId} 
                productName={productName} 
                brand={brand} 
                color={color} 
                imageSrc={imageSrc}
            />
        </UserSection>
    );
}

