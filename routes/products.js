const express = require('express');
const { createWorkout,getProduct  } = require('../controllers/productsController');
const router = express.Router();

// Tausif comment 
// get all products
router.get('/', getProduct)

module.exports = router