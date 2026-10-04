import { Router } from 'express';
import {
  getPrograms,
  getProgramByIdOrSlug,
  createProgram,
  updateProgram,
  deleteProgram,
} from '../controllers/program.controller';
import { validate } from '../middleware/validate';
import {
  getProgramsSchema,
  getProgramByIdOrSlugSchema,
  createProgramSchema,
  updateProgramSchema,
  deleteProgramSchema,
} from '../validators/program.validator';

const router = Router();

router.get('/', validate(getProgramsSchema), getPrograms);
router.get('/:idOrSlug', validate(getProgramByIdOrSlugSchema), getProgramByIdOrSlug);
router.post('/', validate(createProgramSchema), createProgram);
router.patch('/:id', validate(updateProgramSchema), updateProgram);
router.delete('/:id', validate(deleteProgramSchema), deleteProgram);

export default router;
