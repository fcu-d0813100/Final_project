import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';

import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import styles from './index.module.scss';
import { array } from 'prop-types';
import { set, update } from 'lodash';
import Link from 'next/link';
export default function Index(props) {
  const [imgs, setImgs] = useState([]);
  const [inputFocus, setInputFocus] = useState(false);
  const [textFocus, setTextFocus] = useState(false);
  const [title, setTitle] = useState('');
  const [titleLength, setTitleLength] = useState('');
  const [content, setContent] = useState('');
  const [contentLength, setContentLength] = useState('');
  let draggedItemIndex = null;
  const inputRef = useRef(null);
  //img upload
  const inputHandle = () => {
    inputRef.current.click();
  };
  const showHandle = (e) => {
    const files = Array.from(e.target.files);
    if (e.target.files.length + imgs.length > 5) {
      Swal.fire({
        html: `
                  <div class="custom-alert-content">
                    <span class="custom-icon">❌</span> <!-- 使用自定義的縮小圖示 -->
                    <span>請勿上傳超過5張圖片</span>
                  </div>
                `,
        showConfirmButton: false,
        timer: 1500,
        position: 'center',
        width: '300px',
        padding: '1em',
        customClass: {
          popup: `${styles['custom-popup']}`,
        },
      });
      //   alert('  請勿上傳超過5張圖片');
      return;
    }
    const nextImgs = files.map((file) => URL.createObjectURL(file));
    setImgs((prevImgs) => [...prevImgs, ...nextImgs]);
  };
  const deleteImg = (index) => {
    if (imgs.length === 1) {
      Swal.fire({
        html: `
              <div class="custom-alert-content">
                <span class="custom-icon">❌</span> <!-- 使用自定義的縮小圖示 -->
                <span>請至少上傳一張圖片</span>
              </div>
            `,
        showConfirmButton: false,
        timer: 1500,
        position: 'center',
        width: '300px',
        padding: '1em',
        customClass: {
          popup: `${styles['custom-popup']}`,
        },
      });

      return;
    }
    setImgs((prevImgs) => prevImgs.filter((_, i) => i !== index));
  };
  //img drag
  //拖曳圖片的索引
  const dragStartHandle = (index) => {
    draggedItemIndex = index;
  };
  const dragEndHandle = () => {
    draggedItemIndex = null; //不會判斷是否有放入正確
  };
  const dropHandle = (e, dropIndex) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === dropIndex) return;
    const newImgs = [...imgs];
    const draggedItem = newImgs[draggedItemIndex]; //賦值 拖曳圖片在新陣列中的位置
    newImgs.splice(draggedItemIndex, 1);
    newImgs.splice(dropIndex, 0, draggedItem);
    setImgs(newImgs);
    draggedItemIndex = null;
  };
  // title & content
  const titleHandle = (e) => {
    setTitle(e.target.value);
    setTitleLength(e.target.value.length);
  };
  const contentHandle = (e) => {
    setContent(e.target.value);
    setContentLength(e.target.value.length);
  };

  return (
    <>
      <div className={styles['member-post']}>
        <div className={styles['post-section']}>
          <div className={styles['post-title']}>
            <span className="h3">我的貼文</span>
            <span className="h2-L">My Post</span>
          </div>
          <form className={styles['post-form']}>
            <div className={styles['post-content']}>
              {/* 圖片編輯 */}
              <div className={styles['post-img']}>
                <div className={`${styles['img-amount']} h5`}>
                  <div>圖片編輯</div>
                  <div>({imgs.length}/5)</div>
                  <input
                    ref={inputRef}
                    type="file"
                    name="files"
                    accept="image/*"
                    hidden
                    multiple
                    onChange={showHandle}
                  />
                </div>
                <div className={styles['img-area']}>
                  <div
                    className={styles['img-upload-area']}
                    onClick={inputHandle}
                  >
                    <span className="h3">+</span>
                    <span>添加</span>
                  </div>
                  <div className={styles['img-preview-area']}>
                    <div className={styles['img-container']}>
                      {/* map上傳的圖片 */}
                      {imgs.map((src, index) => (
                        //eslint-disable-next-line
                        <div className={styles['image-wrapper']}
                          key={index}
                          draggable
                          onDragStart={() => dragStartHandle(index)}
                          onDragEnd={dragEndHandle}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => dropHandle(e, index)}
                        >
                          <Image src={src} width={98} height={98} alt="image" />
                          {/* //eslint-disable-next-line */}
                          <div
                            className={styles['delete-btn']}
                            onClick={() => deleteImg(index)}
                          >
                            <RxCross2 size={16} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* 貼文內容 */}
              <div className={styles['post-publish']}>
                <div className={`${styles['publish-title']} h5`}>分享內容</div>
                <div className={styles['publish-info']}>
                  <div
                    className={`${styles['info-title']} ${
                      styles[inputFocus ? 'focused' : '']
                    }`}
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                  >
                    <input
                      type="text"
                      name="title"
                      placeholder="標題"
                      value={title}
                      onChange={titleHandle}
                    />
                    <div className={styles['count-tip']}>
                      {titleLength == 0 ? 0 : titleLength}/20
                    </div>
                  </div>
                  <div>
                    <div
                      className={`${styles['info-content']} ${
                        styles[textFocus ? 'focused' : '']
                      }`}
                      onFocus={() => setTextFocus(true)}
                      onBlur={() => setTextFocus(false)}
                    >
                      <textarea
                        type="text"
                        name="content"
                        placeholder="內文"
                        value={content}
                        onChange={contentHandle}
                        className={styles['post-editor']}
                      ></textarea>
                      <div className={styles['count-tip']}>
                        {contentLength == 0 ? 0 : contentLength}/1000
                      </div>
                    </div>
                    <div className={styles['tags']}></div>
                  </div>
                  <input
                    type="text"
                    name="tags"
                    placeholder="#標籤"
                    className={styles['post-tags']}
                  />
                </div>
              </div>
            </div>
            {/* 按鈕 */}
            <div className={styles['post-btn']}>
              <button className="btn-primary h6" type="submit">
                發布
              </button>
              <Link href="/user/post" className={`btn-secondary ${styles['']}`}>
                取消
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
