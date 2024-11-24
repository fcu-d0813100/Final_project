import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';
import Stars from "react-stars";
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import Image from 'next/image';
import useFetchReviews from './fetchReviews';
import { submitReview } from './submitReview';
import WriteReviewModal from './WriteReviewModal';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';

const CommentBoard = ({orderItemId, productId, colorId, brand, productName, colorName, animateChart, productImage }) => {
  console.log('123colorId:', colorId);
  console.log('orderItemId:', orderItemId);
  console.log('productId:', productId);
  // console.log('colorId:', colorId);
  const { auth } = useAuth();
  const isAuthenticated = auth.isAuth; // 判斷是否已登入
  const router = useRouter();
  const { reviews, loading, fetchReviews, handleLike } = useFetchReviews(orderItemId, productId, colorId); // 包含 fetchReviews 方法
  const [animatedDistribution, setAnimatedDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [showWriteReview, setShowWriteReview] = useState(false); // 控制撰寫評論模態視窗
  const [showStarFilterModal, setShowStarFilterModal] = useState(false); // 控制星級篩選模態視窗
  const [selectedStar, setSelectedStar] = useState(null); // 儲存選中的星級數
  const [filteredReviews, setFilteredReviews] = useState([]); // 篩選後的評論

  useEffect(() => {
    if (reviews.length === 0) {
      console.warn('Reviews 為空');
    } else {
      console.log('Reviews:', reviews);
      setFilteredReviews(reviews); // 初始化時顯示所有評論
    }
  }, [reviews]);

  const averageRating = useMemo(() => {
    const validRatings = reviews
      .map(review => Number(review.rating))
      .filter(rating => rating >= 1 && rating <= 5);

    const totalRating = validRatings.reduce((acc, rating) => acc + rating, 0);
    return validRatings.length > 0 ? Number((totalRating / validRatings.length).toFixed(1)) : 0;
  }, [reviews]);

  const ratingDistribution = useMemo(() => {
    if (reviews.length === 0) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach(review => {
      const rating = Math.round(Number(review.rating));
      if (rating >= 1 && rating <= 5) {
        distribution[rating] += 1;
      }
    });

    Object.keys(distribution).forEach(star => {
      distribution[star] = (distribution[star] / reviews.length) * 100;
    });

    return distribution;
  }, [reviews]);

  useEffect(() => {
    if (animateChart) {
      setAnimatedDistribution({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      const timeout = setTimeout(() => {
        setAnimatedDistribution(ratingDistribution);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [animateChart, ratingDistribution]);

  // 星級篩選邏輯
  const handleStarFilter = (star) => {
    const filtered = reviews.filter(review => Math.round(Number(review.rating)) === star);
    setFilteredReviews(filtered);
    setSelectedStar(star);
    setShowStarFilterModal(false);
  };

  // 圖片/影片篩選邏輯
  const handleMediaFilter = () => {
    const filtered = reviews.filter(review => review.media && review.media.length > 0);
    setFilteredReviews(filtered);
  };

  const handleShowWriteReview = () => {
    if (!isAuthenticated) {
      toast.error('請先登入後再進行評論', {
        style: { border: '1px solid #90957a', padding: '12px 40px', color: '#963827' },
        iconTheme: { primary: '#963827', secondary: '#fff' },
      });
      router.push('/user/login/user');
      return;
    }
    setShowWriteReview(true);
  };
  const handleCloseWriteReview = () => setShowWriteReview(false);

  const handleSaveReview = async (reviewData, mediaFiles) => {
    if (!isAuthenticated) {
      router.push('/user/login/user');
      return;
    }
    await submitReview(productId, colorId, { 
      ...reviewData, 
      order_id: orderItemId,  
      user_id: auth.userData.id, 
    }, mediaFiles);
    fetchReviews();
  };

  // const handleLike = async (reviewId, isLiked) => {
  //   try {
  //     // 根據當前的點讚狀態選擇 API 路由
  //     const route = isLiked
  //       ? `/api/reviews/${reviewId}/unlike`
  //       : `/api/reviews/${reviewId}/like`;
  
  //     // 發送請求
  //     const response = await fetch(route, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //     });
  
  //     if (response.ok) {
  //       // 更新前端的 likes 數據
  //       const updatedReviews = reviews.map((review) => {
  //         if (review.review_id === reviewId) {
  //           return {
  //             ...review,
  //             review_likes: isLiked
  //               ? review.review_likes - 1
  //               : review.review_likes + 1,
  //             isLiked: !isLiked, // 切換點讚狀態
  //           };
  //         }
  //         return review;
  //       });
  //       setFilteredReviews(updatedReviews);
  //     } else {
  //       console.error('更新點讚失敗');
  //     } 
  //   } catch (error) {
  //     console.error('點讚時出錯:', error);
  //   }
  // };
  
  

  if (loading) return <div>Loading comments...</div>;

  return (
    <Container id="reviews" className={styles['commentBoard']}>
      {reviews.length === 0 ? (
        <div className={styles['no-reviews']}>
          <p className={`${styles['no-reviews-p']} h5`}>目前還沒有評論</p>
          <p className={`${styles['no-reviews-p']} h5`}>購買後即可撰寫您的體驗分享！</p>
        </div>
      ) : (
        <>
          <Row className={styles['commentupper']}>
            <Col md={6} className={styles['ratingOverview']}>
              <div className={styles['averageRating']}>
                <div className={styles['ratingScore']}>{averageRating.toFixed(1)}</div>
                <Stars count={5} value={parseFloat(averageRating)} size={25} edit={false} color2={"#9ea28b"} color1={"#ccc"} />
              </div>
              <div className={styles['ratingDistribution']}>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} className={`${styles['ratingRow']} p`}>
                    {star}.0 星
                    <div className={styles['ratingRectangle']}>
                      <div
                        className={styles['ratingFill']}
                        style={{
                          width: `${animatedDistribution[star]}%`,
                          backgroundColor: '#9ea28b',
                          height: '100%',
                          transition: 'width 1s ease'
                        }}
                      ></div>
                    </div>
                    <div className={styles['percentage']}>
                      {Math.round(animatedDistribution[star])}%
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col md={6} className={styles['filterButtons']}>
              <Button variant="outline-secondary" className={styles['button']} onClick={() => setFilteredReviews(reviews)}>
                全部 ({reviews.length})
              </Button>
              <Button variant="outline-secondary" className={styles['button']} onClick={handleMediaFilter}>
                附上圖片/影片 ({reviews.filter(review => review.media.length > 0).length})
              </Button>
              <Button variant="outline-secondary" className={styles['button']} onClick={() => setShowStarFilterModal(true)}>
                星等 ★
              </Button>
            </Col>
          </Row>

          <div className={styles['commentList']}>
            {filteredReviews.map((review, index) => {
              console.log(`Review ${index + 1}:`, review); // 在控制台打印出每个 review 的内容
              return (
                <div key={review.order_item_id} className={styles['commentItem']}>
                  <div className={styles['userInfo']}>
                    <Image
                      width={64}
                      height={64}
                      src={review.user_avatar || '/default-avatar.png'}
                      className={styles['avatar']}
                    />
                    <div className={styles['userDetails']}>
                      <div className={styles['userHeader']}>
                        <span className={`${styles['username']} h6`}>{review.username || '匿名'}</span>
                        <div className={styles['date-likes']}>
                          <div className={styles['timestamp']}>{review.review_date}</div>
                        </div>
                      </div>
                      <div className="ps">
                        規格 - {brand} {productName} - {colorName}
                      </div>
                    </div>
                  </div>
                  <div className={styles['rating']}>
                    <Stars count={5} value={review.rating} size={20} edit={false} color2={'#90957a'} color1={'#d3d3d3'} />
                  </div>
                  <p className={styles['commentBoard']}>{review.comment}</p>
                  {Array.isArray(review.media) && review.media.length > 0 && (
                    <div className={styles['commentImages']}>
                      {review.media.map((media, index) =>
                        media.file_name.endsWith('.mp4') ? (
                          <video key={media.id} width="150" controls>
                            <source src={media.url} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <Image
                            key={media.id}
                            src={`http://localhost:3005/upload/reviews/images/${media.file_name}`}
                            alt="Review media"
                            width={93}
                            height={93}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <Modal show={showStarFilterModal} onHide={() => setShowStarFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>選擇星等</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {[5, 4, 3, 2, 1].map(star => (
            <Button key={star} className={`${styles['starfilter']}  m-2`} variant="outline-secondary" onClick={() => handleStarFilter(star)}>
              {star} 星
            </Button>
          ))}
        </Modal.Body>
      </Modal>

      <WriteReviewModal 
        show={showWriteReview} 
        onClose={handleCloseWriteReview} 
        brand={brand} 
        productImage={productImage}
        productName={productName} 
        colorName={colorName} 
        submitReview={handleSaveReview}
        colorId={colorId} 
        productId={productId}
        fetchReviews={fetchReviews}
      />
    </Container>
  );
};

export default CommentBoard;
