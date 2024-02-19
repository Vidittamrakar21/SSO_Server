import express from 'express'
//@ts-ignore
import {createaccess,createsession, createuser, finduser} from "../controller/user"


const router = express.Router();


router.route('/login').post(createaccess)
router.route('/session').get(createsession) 
router.route('/signuser').post(createuser) 
router.route('/finduser').post(finduser) 

module.exports = router;