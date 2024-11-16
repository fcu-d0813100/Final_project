import UserSection from '@/components/user/common/user-section';
import { useRouter } from 'next/router';
import CommentForm from '@/components/product/common/comment';

export default function Explore(props) {
    const router = useRouter();
    const { productId, colorId, productName, brand, color, imageSrc } = router.query;
   
    useEffect(() => {
      console.log('Received query params in Explore:', {
        productId,
        colorId,
        productName,
        brand,
        color,
        imageSrc,
      });
    }, [productId, colorId, productName, brand, color, imageSrc]);

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

