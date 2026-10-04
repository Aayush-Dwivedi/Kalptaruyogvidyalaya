import { Router } from 'express';
import {
  getMembershipPlans,
  getMembershipPlanByIdOrSlug,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
} from '../controllers/membership.controller';
import { validate } from '../middleware/validate';
import {
  getMembershipPlansSchema,
  getMembershipPlanByIdOrSlugSchema,
  createMembershipPlanSchema,
  updateMembershipPlanSchema,
  deleteMembershipPlanSchema,
} from '../validators/membership.validator';

const router = Router();

router.get('/', validate(getMembershipPlansSchema), getMembershipPlans);
router.get('/:idOrSlug', validate(getMembershipPlanByIdOrSlugSchema), getMembershipPlanByIdOrSlug);
router.post('/', validate(createMembershipPlanSchema), createMembershipPlan);
router.patch('/:id', validate(updateMembershipPlanSchema), updateMembershipPlan);
router.delete('/:id', validate(deleteMembershipPlanSchema), deleteMembershipPlan);

export default router;
