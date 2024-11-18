// submitReview.js
export const uploadMedia = async (mediaFiles) => {
  const uploadedMedia = [];

  if (mediaFiles && mediaFiles.length > 0) {
    const uploadPromises = mediaFiles.map(async (file) => {
      const formData = new FormData();
      formData.append('mediaFiles', file);

      const response = await fetch(`http://localhost:3005/upload/reviews/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed to upload media: ${response.status}`);
      const { files } = await response.json();
      uploadedMedia.push(...files);
    });

    await Promise.all(uploadPromises);
  }

  return uploadedMedia;
};

export const submitReview = async (productId, colorId, reviewData, mediaFiles) => {
  console.log("Review Data inside submitReview:", reviewData);  // reviewData 的内容
  
  try {
    const formData = new FormData();
    formData.append('product_id', productId);
    formData.append('color_id', colorId);
    formData.append('rating', Number(reviewData.rating) || 0);
    formData.append('comment', reviewData.comment || '');
    formData.append('order_id', reviewData.order_id); // 確保包含 order_id
    formData.append('user_id', reviewData.user_id); // 確保包含 user_id
    formData.append('order_id', reviewData.order_id); // 包含 orderItemId
     // 检查 FormData 内容
     console.log("FormData inside submitReview before adding media files:");
     for (let [key, value] of formData.entries()) {
       console.log(`${key}: ${value}`);
     }
    
    if (mediaFiles && mediaFiles.length > 0) {
      mediaFiles.forEach((file) => {
        formData.append('mediaFiles', file);
      });
    }

    // 再次检查 FormData 内容，包括文件
    console.log("FormData inside submitReview after adding media files:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof Blob ? "File Blob" : value); // 如果是文件Blob，输出Blob
    }


    const response = await fetch(`http://localhost:3005/api/product/create-review/${productId}/${colorId}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error(`Failed to submit review: ${response.status}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};
