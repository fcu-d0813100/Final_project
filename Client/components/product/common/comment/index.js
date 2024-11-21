import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import Stars from "react-stars";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/use-auth';

const CommentForm = ({ orderId, quantity, productId, colorId, color_name, productName, brand, color, imageSrc }) => {

  console.log("傳入的參數：");
  console.log("orderId:", orderId);
  console.log("quantity:", quantity);
  console.log("productId:", productId);
  console.log("colorId:", colorId);
  console.log("color_name:", color_name);
  console.log("productName:", productName);
  console.log("brand:", brand);
  console.log("color:", color);
  console.log("imageSrc:", imageSrc);

  const { auth } = useAuth(); // 使用 useAuth 來取得登入狀態與使用者資料
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const router = useRouter();

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddImage = () => {
    document.getElementById('file-input').click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]); // 將文件物件直接存入 images 狀態
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setComment('');
    setRating(0);
    setImages([]);
  };

  // 清理使用的 URL 對象，防止內存洩漏
  useEffect(() => {
    return () => {
      images.forEach((file) => {
        if (file instanceof File) {
          URL.revokeObjectURL(file);
        }
      });
    };
  }, [images]);

  // 保存評論到後端
  const handleSave = async () => {
    if (!auth.isAuth) {
      alert('請先登入後再提交評論');
      router.push('/user/login/user'); // 導向登入頁面
      return;
    }

    console.log("User ID:", auth.userData.id); // 檢查是否獲得正確的使用者 ID

    const formData = new FormData();
    formData.append("order_id", orderId);
    formData.append("quantity", quantity);
    formData.append("product_id", productId);
    formData.append("color_id", colorId);
    formData.append("comment", comment);
    formData.append("rating", rating);
    formData.append("user_id", auth.userData.id); // 傳遞登入使用者的 ID

    images.forEach((image) => {
      formData.append("mediaFiles", image);
    });

    try {
      const response = await fetch(`http://localhost:3005/api/product/create-review/${productId}/${colorId}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('評論提交成功');
        router.push(`/product/product-list/${colorId}#reviews`);
      } else {
        console.error('評論提交失敗');
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
            <span className={styles['color-text']}>顏色：{color_name}</span>
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
            color1={"#ccc"}
          />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col xs={12} className="d-flex gap-2">
          {images.map((file, index) => (
            <div key={index} className={styles['image-wrapper']} style={{ position: 'relative' }}>
              <Image
                width={98}
                height={98}
                src={file instanceof File ? URL.createObjectURL(file) : file} // 確保 file 是 File 對象
                alt={`Review image ${index + 1}`}
              />
              <button onClick={() => handleRemoveImage(index)} className={styles['remove-button']}>
                &times;
              </button>
            </div>
          ))}
          <div className={styles['add-image']} onClick={handleAddImage}>
            <span className={styles['add-icon']}>+</span>
            <span className={styles['add-text']}>增加圖片</span>
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
              onChange={handleCommentChange}
              placeholder="分享您的購物體驗或是幫助其他人更好了解此商品的優缺點"
              className={`${styles['editable-comment']}`}
              style={{
                border: '1px solid #ddd',
                padding: '8px',
                minHeight: '120px',
                borderRadius: '4px',
                overflowY: 'auto',
                resize: 'none',
                outline: 'none',
                fontSize: '16px',
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="justify-content-end">
        <Col xs="auto">
          <Button className={`${styles['product-comment-cancel']} btn-secondary`} onClick={handleCancel}>
            取消
          </Button>
        </Col>
        <Col xs="auto">
          <Button className={`${styles['product-comment-save']} btn-primary`}  onClick={handleSave}>
            儲存
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CommentForm;
