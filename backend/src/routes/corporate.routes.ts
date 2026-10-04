import { Router } from 'express';
import {
  getCorporatePrograms,
  getCorporateProgramByIdOrSlug,
  createCorporateProgram,
  updateCorporateProgram,
  deleteCorporateProgram,
} from '../controllers/corporate.controller';
import { validate } from '../middleware/validate';
import {
  getCorporateProgramsSchema,
  getCorporateProgramByIdOrSlugSchema,
  createCorporateProgramSchema,
  updateCorporateProgramSchema,
  deleteCorporateProgramSchema,
} from '../validators/corporate.validator';

const router = Router();

router.get('/', validate(getCorporateProgramsSchema), getCorporatePrograms);
router.get('/:idOrSlug', validate(getCorporateProgramByIdOrSlugSchema), getCorporateProgramByIdOrSlug);
router.post('/', validate(createCorporateProgramSchema), createCorporateProgram);
router.patch('/:id', validate(updateCorporateProgramSchema), updateCorporateProgram);
router.delete('/:id', validate(deleteCorporateProgramSchema), deleteCorporateProgram);

export default router;
