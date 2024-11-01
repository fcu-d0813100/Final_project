import React, { useEffect, useState } from 'react';
import styles from './index.module.scss';
import Stars from "react-stars";
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from 'next/image';

const CommentBoard = () => {
  const comments = [
    {
      username: 'Tiffany',
      rating: 5,
      date: '2024-11-29',
      likes: 2,
      comment: '這款產品真的很棒，顏色很自然。',
      images: ['/product/commentimg1.png', '/product/commentimg2.png']
    },
    {
      username: 'Tiffany',
      rating: 5,
      date: '2024-11-29',
      likes: 2,
      comment: '這款產品用起來非常舒適，值得推薦！',
      images: ['/product/commentimg1.png', '/product/commentimg2.png']
    },
    // 可以添加更多留言
  ];

  const [averageRating, setAverageRating] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});

  // 計算平均評分和星等分佈
  useEffect(() => {
    const totalRating = comments.reduce((acc, comment) => acc + comment.rating, 0);
    const avgRating = comments.length > 0 ? totalRating / comments.length : 0;
    setAverageRating(avgRating.toFixed(1));

    // 計算星等分佈
    const distribution = [5, 4, 3, 2, 1].reduce((acc, star) => {
      const count = comments.filter(comment => comment.rating === star).length;
      acc[star] = (count / comments.length) * 100 || 0;
      return acc;
    }, {});

    setRatingDistribution(distribution);
  }, [comments]);

  return (
    <Container className={styles['commentBoard']}>
      <Row className={styles['commentupper']}>
        {/* 評分概覽 */}
        <Col md={6} className={styles['ratingOverview']}>
          <div className={styles['averageRating']}>
            {/* 評分數字 */}
            <div className={styles['ratingScore']}>{averageRating}</div>
            {/* 評分星星 */}
            <Stars
              count={5}
              value={parseFloat(averageRating)}
              size={25}
              edit={false}
              color2={"#90957a"}
            />
          </div>
          {/* 評分長條圖 */}
          <div className={styles['ratingDistribution']}>
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className={`${styles['ratingRow']} p`}>
                {star}.0 星
                <div className={styles['ratingRectangle']}>
                  <div
                    className={styles['ratingFill']}
                    style={{
                      width: `${ratingDistribution[star]}%`,
                      backgroundColor: '#90957a',
                      height: '100%' // 確保內部填滿高度
                    }}
                  ></div>
                </div>
                <div className={styles['percentage']}>
                  {Math.round(ratingDistribution[star])}%
                </div>
              </div>
            ))}
          </div>
        </Col>

        {/* 篩選按鈕 */}
        <Col md={6} className={styles['filterButtons']}>
          <Button variant="outline-secondary" className={styles['button']}>
            全部 ({comments.length})
          </Button>
          <Button variant="outline-secondary" className={styles['button']}>
            附上圖片/影片 ({comments.filter(comment => comment.images.length > 0).length})
          </Button>
          <Button variant="outline-secondary" className={styles['button']}>
            星等 ★
          </Button>
        </Col>
      </Row>
      
      {/* 留言列表 */}
      <div className={styles['commentList']}>
        {comments.map((comment, index) => (
          <div key={index} className={styles['commentItem']}>
          <div className={styles['userInfo']}>
            <Image
              width={64}
              height={64}
              src="/product/commentuserprofile.png"
              alt={`${comment.username}'s avatar`}
              className={styles['avatar']}
            />
            <div className={styles['userDetails']}>
              <div className={styles['userHeader']}>
                <span className={`${styles['username']} h6`}>{comment.username}</span>
                <span className={styles['timestamp']}>{comment.date}</span>
                <span className={styles['helpful']}>有幫助 ({comment.likes})</span>
              </div>
              <div className='ps'>規格 - LANCOME 玲瓏巧思五色眼影盤 - 來杯摩卡-01</div>
            </div>
          </div>
        
          <div className={styles['rating']}>
            <Stars
              count={5}
              value={comment.rating}
              size={20}
              edit={false}
              color2={"#90957a"}
            />
          </div>
        
          <p className={styles['commentText']}>{comment.comment}</p>
          
          <div className={styles['commentImages']}>
            {comment.images.map((src, index) => (
              <Image
                width={93}
                height={93}
                src={src}
                alt={`Comment image ${index + 1}`}
                key={index}
                className={styles['commentImage']}
              />
            ))}
          </div>
        
          <div className={styles['commentFooter']}>
            <div className={styles['actions']}>
              <span className="edit">編輯</span> | <span className="delete">刪除</span>
            </div>
          </div>
        </div>
        
        ))}
      </div>
    </Container>
  );
};

export default CommentBoard;
