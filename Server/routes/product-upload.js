// routes/product-upload.js
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload/reviews/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// 文件上传路由
router.post('/upload/reviews/images', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path.replace('public/', '');
    res.status(201).json({ fileName: req.file.filename, filePath });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: '文件上传失败' });
  }
});

export default router;
