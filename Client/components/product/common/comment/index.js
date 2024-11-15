import React, { useState } from 'react';
import styles from './index.module.scss';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Stars from "react-stars";
import Image from 'next/image';
import { useRouter } from 'next/router';

const CommentForm = ({ productId, colorId, productName, brand, color, imageSrc }) => {

  console.log("傳入的參數：");
  console.log("productId:", productId);
  console.log("colorId:", colorId);
  console.log("productName:", productName);
  console.log("brand:", brand);
  console.log("color:", color);
  console.log("imageSrc:", imageSrc);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const router = useRouter();

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.currentTarget.innerText);
  };

  const handleAddImage = () => {
    document.getElementById('file-input').click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setComment('');
    setRating(0);
    setImages([]);
  };

  // 保存評論到後端
  const handleSave = async () => {
    const reviewData = {
      productId,
      colorId,
      rating,
      comment,
    };

    try {
      const response = await fetch(`/api/reviews/create-review/${productId}/${colorId}`, {
        method: 'POST',
        body: JSON.stringify({ reviewData, mediaFiles: images }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('評論提交成功');
        router.push(`/product/detail/${productId}`);
      } else {
        console.log('評論提交失敗');
      }
    } catch (error) {
      console.error('提交評論時出錯:', error);
    }
  };

  return (
    <Container className={`${styles['container']} ${styles['custom-link']} p-4`} style={{ maxWidth: '1440px' }}>
      <Row className={`${styles['commentrow']} align-items-center mb-4`}>
        <Col xs={2}>
          <Image
            width={160}
            height={160}
            src={imageSrc}
            alt={`${brand} ${productName}`}
          />
        </Col>
        <Col xs={10} className={styles['order-detail']}>
          <h5 className='p'>{brand}</h5>
          <div className={`${styles['productname']} h6`}>{productName}</div>
          <p className={`${styles['color']} ps`}>
            <span className={styles['color-swatch']} style={{ backgroundColor: color }}></span>
            <span className={styles['color-text']}>顏色：{color}</span>
          </p>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} className="d-flex align-items-center">
          <h6 className="h5 mb-0 me-3">商品品質</h6>
          <Stars
            count={5}
            value={rating}
            size={24}
            onChange={handleRatingChange}
            color2={"#90957a"}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} className="d-flex gap-2">
          {images.map((src, index) => (
            <div key={index} className={styles['image-wrapper']} style={{ position: 'relative' }}>
              <Image
                width={98}
                height={98}
                src={src}
                alt={`Review image ${index + 1}`}
              />
              <button onClick={() => handleRemoveImage(index)} className={styles['remove-button']}>
                &times;
              </button>
            </div>
          ))}
          <div className={styles['add-image']} onClick={handleAddImage}>
            <span className={styles['add-icon']}>+</span>
            <span className={styles['add-text']}>增加圖/影片</span>
          </div>
          <input
            type="file"
            id="file-input"
            multiple
            accept="image/webp,video/mp4"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12}>
        <Form.Group controlId="comment">
    <Form.Label className="h5">評論</Form.Label>
    <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="分享您的購物體驗或是幫助其他人更好了解此商品的優缺點"
        className={`${styles['editable-comment']}`}
        style={{
            border: '1px solid #ddd',  // 邊框顏色
            padding: '8px',            // 內邊距
            minHeight: '120px',         // 最小高度
            borderRadius: '4px',       // 圓角
            overflowY: 'auto',         // 自動出現垂直滾動條
            resize: 'none',            // 禁止用戶調整大小
            outline: 'none',           // 去除點擊時的藍色邊框
            fontSize: '16px',          // 字體大小
        }}
    />
</Form.Group>

        </Col>
      </Row>

      <Row className="justify-content-end">
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={handleCancel}>
            取消
          </Button>
        </Col>
        <Col xs="auto">
          <Button variant="dark" onClick={handleSave}>
            儲存
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CommentForm;
