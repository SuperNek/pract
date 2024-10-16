import express from "express";
import { getPartners } from "../controllers/partnersController.js";
import { getPartner } from "../controllers/partnersController.js";
import { updateAllDiscounts } from "../controllers/discountController.js";
import { getNewPartnerForm } from "../controllers/partnersController.js";
import { savePartner } from "../controllers/partnersController.js";
import { deletePartner } from "../controllers/partnersController.js";

const router = express.Router();

router.get('/partners', getPartners);

router.get('/partners/new', getNewPartnerForm);

router.get('/partners/:id/edit', getPartner);

router.get('/update_discounts', updateAllDiscounts);

router.post('/partners/save', savePartner);

router.post('/partners/:id/delete', deletePartner);

export default router;