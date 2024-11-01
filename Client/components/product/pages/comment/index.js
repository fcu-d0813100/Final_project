import UserSection from '@/components/user/common/user-section';
import CommentForm from '@/components/product/common/comment';

export default function Explore(props) {
  return (
    <>
      <UserSection titleCN="商品評論" titleENG="Comment">
        <CommentForm />
      </UserSection>
    </>
  );
}

