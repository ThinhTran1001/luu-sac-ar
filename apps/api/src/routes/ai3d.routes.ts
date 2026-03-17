import { Router } from 'express';
import { AI3DController } from '../controllers/ai3d.controller';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.post('/generate', upload.single('image'), AI3DController.generate);
router.get('/status/:taskId', AI3DController.getStatus);
router.post('/upload-glb', AI3DController.uploadGlb);
router.post('/convert-usdz', AI3DController.convertToUsdz);
router.post('/finalize', AI3DController.finalize);

export default router;
