import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Stars from "react-stars";
import Image from 'next/image';

const CommentForm = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([
    '/product/commentimg1.png',
    '/product/commentimg2.png'
  ]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.innerText);
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
    setImages([
      '/product/commentimg1.png',
      '/product/commentimg2.png'
    ]);
  };

  const handleSave = () => {
    console.log('Save clicked');
    // Save review logic here
  };

  // const [productData, setProductData] = useState(null);

  // useEffect(() => {
  //   const storedProductData = localStorage.getItem('productData');
  //   if (storedProductData) {
  //     setProductData(JSON.parse(storedProductData));
  //   }
  // }, []);

  // if (!productData) {
  //   return <div>無法獲取商品資料。</div>; // 顯示錯誤或加載提示
  // }

  // const { productId, colorId, mainimage, brand, product_name, color_name, color } = productData;

  return (
    <Container className={`${styles['container']} ${styles['custom-link']} p-4`} style={{ maxWidth: '1440px' }}>
      <Row className={`${styles['commentrow']} align-items-center mb-4`}>
        <Col xs={2}>
          <Image
            width={160}
            height={160}
            src={mainimage}
            alt="Product"
          />
        </Col>
        <Col xs={10} className={styles['order-detail']}>
          <h5 className='p'>{brand} <br /></h5>
          <div className={`${styles['productname']} h6`}>{product_name}</div>
          <p className={`${styles['color']} ps`}><span className={styles['color-swatch']}  style={{ backgroundColor: color }}></span><span className={styles['color-text']}>顏色：{color_name}</span></p>
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
              <button
                onClick={() => handleRemoveImage(index)}
                className={styles['remove-button']}
              >
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
            <div
              contentEditable
              className={`${styles['editable-comment']}`}
              placeholder="分享您的購物體驗或是幫助其他人更好了解此商品的優缺點"
              onInput={handleCommentChange}
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                minHeight: '120px',
                borderRadius: '4px',
                overflowY: 'auto',
              }}
            >
              {comment}
            </div>
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
