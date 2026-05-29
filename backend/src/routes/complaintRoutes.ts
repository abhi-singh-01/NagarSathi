import { Router } from 'express';
import * as complaintController from '../controllers/complaintController';
import { authenticate } from '../middleware/auth';
import { uploadPhoto } from '../middleware/upload';
import { validate } from '../middleware/validate';
import {
  createComplaintSchema,
  nearbyQuerySchema,
  updateComplaintSchema,
} from '../validators/schemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/nearby', validate(nearbyQuerySchema, 'query'), asyncHandler(complaintController.getNearbyComplaints));

router.get('/mine', authenticate, asyncHandler(complaintController.listMyComplaints));

router.get('/', asyncHandler(complaintController.listComplaintsFlat));

router.post(
  '/',
  authenticate,
  uploadPhoto,
  validate(createComplaintSchema),
  asyncHandler(complaintController.createComplaint)
);

router.get('/:id', asyncHandler(complaintController.getComplaintById));

router.patch(
  '/:id',
  authenticate,
  validate(updateComplaintSchema),
  asyncHandler(complaintController.updateComplaint)
);

router.delete('/:id', authenticate, asyncHandler(complaintController.deleteComplaint));

export default router;
