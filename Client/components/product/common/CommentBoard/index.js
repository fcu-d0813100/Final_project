import React, { useEffect, useMemo, useState } from 'react';
import styles from './index.module.scss';
import Stars from "react-stars";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';
import useFetchReviews from './fetchReviews';
import { submitReview } from './submitReview';
import WriteReviewModal from './WriteReviewModal'

const CommentBoard = ({ productId, colorId, brand, productName, colorName, animateChart, productImage }) => {
  console.log('colorId:', colorId)
  const { reviews, loading, fetchReviews } = useFetchReviews(productId); // 包含 fetchReviews 方法
  // const { submitReview } = useFetchReviews(productId, colorId);
  const [animatedDistribution, setAnimatedDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [showWriteReview, setShowWriteReview] = useState(false); // 控制模態視窗的狀態

  useEffect(() => {
    console.log('Reviews from API in CommentBoard:', reviews);
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
  
    // 計算每個星級的數量
    reviews.forEach(review => {
      const rating = Math.round(Number(review.rating));
      if (rating >= 1 && rating <= 5) {
        distribution[rating] += 1;
      }
    });

    // 將每個星級的數量轉換為百分比
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
  
  // 顯示和隱藏撰寫評論模態視窗的控制函數
  const handleShowWriteReview = () => setShowWriteReview(true);
  const handleCloseWriteReview = () => setShowWriteReview(false);

   // 保存評論並刷新列表
   const handleSaveReview = async (reviewData, mediaFiles) => {
    console.log('colorId:', colorId)
    await submitReview(productId, colorId, reviewData, mediaFiles);
    fetchReviews(); // 提交評論後刷新評論列表
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <Container className={styles['commentBoard']}>
      {reviews.length === 0 ? (
        // 沒有評論時顯示的提示信息和撰寫評論按鈕
        <div className={styles['no-reviews']}>
          <p className={`${styles['no-reviews-p']} h5`}>目前還沒有評論</p>
          <p className={`${styles['no-reviews-p']} h5`}>成為首位評論者，和大家分享您的心得！</p>
          <Button variant="dark" className={'btn-primary'} onClick={handleShowWriteReview}>
            撰寫評論
          </Button>
        </div>
      ) : (
        <>
          <Row className={styles['commentupper']}>
            <Col md={6} className={styles['ratingOverview']}>
              <div className={styles['averageRating']}>
                <div className={styles['ratingScore']}>{averageRating}</div>
                <Stars
                  count={5}
                  value={averageRating}
                  size={25}
                  edit={false}
                  color2={"#9ea28b"}
                  color1={"#ccc"}
                />
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
              <Button variant="outline-secondary" className={styles['button']}>
                全部 ({reviews.length})
              </Button>
              <Button variant="outline-secondary" className={styles['button']}>
                附上圖片/影片 ({reviews.filter(review => review.media.length > 0).length})
              </Button>
              <Button variant="outline-secondary" className={styles['button']}>
                星等 ★
              </Button>
            </Col>
          </Row>

          <div className={styles['commentList']}>
            {reviews.map((review) => (
              <div key={review.order_item_id} className={styles['commentItem']}>
                <div className={styles['userInfo']}>
                  <Image
                    width={64}
                    height={64}
                    src="/product/commentuserprofile.png"
                    alt={`${review.username}'s avatar`}
                    className={styles['avatar']}
                  />
                  <div className={styles['userDetails']}>
                    <div className={styles['userHeader']}>
                      <span className={`${styles['username']} h6`}>{review.username || '匿名'}</span>
                      <div className={styles['date-likes']}>
                        <div className={styles['timestamp']}>{review.review_date}</div>
                        <span className={styles['helpful']}>有幫助 ({review.review_likes})</span>
                      </div>
                    </div>
                    <div className='ps'>規格 - {brand} {productName} - {colorName}</div>
                  </div>
                </div>
              
                <div className={styles['rating']}>
                  <Stars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    color2={"#90957a"}
                    color1={"#d3d3d3"}
                  />
                </div>
              
                <p className={styles['commentBoard']}>{review.comment}</p>
                
                <div className={styles['commentImages']}>
                  {review.media.map((media, index) => (
                    media.file_type === '.mp4' ? (
                      <video key={index} width="150" controls className={styles['commentMedia']}>
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <img
                        width={93}
                        height={93}
                        src={`/upload/reviews/images/${media.file_name}`}
                        alt={`Comment media ${index + 1}`}
                        key={index}
                        className={styles['commentImage']}
                      />
                    )
                  ))}
                </div>

                <div className={styles['commentFooter']}>
                  <div className={styles['actions']}>
                    <span className={`${styles['edit']} me-2`}>編輯</span> |
                    <span className={styles['delete']}>刪除</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 使用分離出的 WriteReviewModal 組件 */}
      <WriteReviewModal 
        show={showWriteReview} 
        onClose={handleCloseWriteReview} 
        brand={brand} 
        productImage={productImage}
        productName={productName} 
        colorName={colorName} 
        submitReview ={handleSaveReview} // 傳入 submitReview 函數
        colorId={colorId} // 傳入 colorId 用於保存評論
        productId={productId}
        fetchReviews={fetchReviews} // 傳入 fetchReviews
      />
    </Container>
  );
};

export default CommentBoard;
