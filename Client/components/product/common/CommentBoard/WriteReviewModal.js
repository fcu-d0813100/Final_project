import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import Stars from "react-stars";
import Image from 'next/image';
import styles from "./index.module.scss";
import {submitReview} from './submitReview';
import {useFetchReviews} from './fetchReviews';

const WriteReviewModal = ({ show, onClose, brand, productName, colorName, productImage, colorId, productId, fetchReviews }) => {
  console.log('Received colorId:', colorId); // 檢查 colorId 是否被傳遞

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]); // 儲存選擇的圖片文件

  // 當用戶更改星級評分時更新 rating 狀態
  const handleRatingChange = (newRating) => {
    console.log('Selected Rating:', newRating);
    setRating(newRating);
  };

  // 當用戶輸入評論時更新 comment 狀態
  const handleCommentChange = (e) => {
    setComment(e.target.innerText);
  };

  // 當用戶選擇圖片文件時更新 mediaFiles 狀態
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // 獲取選擇的文件
    setMediaFiles((prevFiles) => [...prevFiles, ...files]); // 添加到 mediaFiles 狀態
  };

  // 提交評論
  const handleSaveReview = async () => {
    const reviewData = {
      rating,
      comment,
    };

    console.log("Review Data in handleSaveReview:", reviewData); // 检查 reviewData 的内容
    console.log("Media files:", mediaFiles); // 检查 mediaFiles 的内容

    // 调用 submitReview，将 productId, colorId, reviewData, 和 mediaFiles 传入
    await submitReview(productId, colorId, reviewData, mediaFiles);
    fetchReviews();
    onClose(); // 关闭模态窗口
};

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>評論商品</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className={`${styles['productInfo']} d-flex`}>
            <Image 
              src={`/product/mainimage/${productImage}`}
              alt={`${productName} 圖片`} 
              width={120} 
              height={120} 
              className={styles['productThumbnail']} 
            />
            <div className={styles['infoName']}>
              <h5>{brand} {productName}</h5>
              <p>規格 - {colorName}</p>
            </div>
          </div>
          <div className={styles['ratingStars']}>
            <Stars 
              count={5} 
              size={24} 
              color1={"#ccc"} 
              color2={"#9ea28b"} 
              value={rating}
              onChange={handleRatingChange}
            />
          </div>
          <div
          contentEditable="true"
          onInput={(e) => setComment(e.target.innerText)}
          className={`${styles['editableDiv']} ${styles['commentText']}`}
          placeholder="分享您的使用心得，幫助其他用戶了解此產品"
        />

          <div className={styles['imageUpload']}>
            <input 
              type="file" 
              multiple 
              accept="image/*,video/*" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
              id="fileInput"
            />
            <Button 
              variant="outline-secondary" 
              className={styles['uploadButton']} 
              onClick={() => document.getElementById('fileInput').click()}
            >
              + 添加圖片
            </Button>
            <div className={styles['mediaPreview']}>
              {mediaFiles.map((file, index) => (
                <div key={index} className={styles['previewItem']}>
                  {file.type.startsWith('image') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview ${index}`}
                      width={60}
                      height={60}
                      className={styles['previewImage']}
                    />
                  ) : (
                    <video width={60} height={60} controls className={styles['previewVideo']}>
                      <source src={URL.createObjectURL(file)} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className={styles['btn-cancel']} onClick={onClose}>取消</Button>
        <Button className={styles['btn-save']} variant="dark" onClick={handleSaveReview}>保存</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WriteReviewModal;
