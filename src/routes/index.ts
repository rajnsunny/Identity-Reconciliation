import identifyRoutes from './identify.route';
import { Router } from 'express';

const router = Router();

router.use('/', identifyRoutes);

export default router;
