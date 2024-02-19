import express from 'express'
//@ts-ignore
import {createuser, finduser ,existinguser} from "../controller/user"


const router = express.Router();

router.route('/signuser').post(createuser) 
router.route('/finduser').post(finduser) 
router.route('/exist').post(existinguser) 

module.exports = router;