const adminController = require("../controllers/adminController");
const express = require('express');
const router = express.Router();

/* DASHBOARD */
router.get("/", adminController.adminDashboard);

/* USER */
router.get('/user/add', adminController.addUserForm);
router.put('/user/edit/:id', adminController.updateUser);
router.patch('/user/delete/:id', adminController.deleteUser); //soft delete

module.exports = router;
