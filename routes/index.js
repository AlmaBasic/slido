const indexController = require('../controllers/indexController');
const express = require('express');
const router = express.Router();

router.get('/', indexController.landingPage);
router.post('/enter', indexController.enterLecture);
router.post('/like/:id', indexController.likeQuestion);
router.post('/rate/:id', indexController.rateLecture);

/* USER */
router.get('/login', indexController.loginPage);
router.post('/login', indexController.checkLogin, indexController.sendToken);
router.get('/logout', indexController.logout);

/* QUESTION */
router.get('/question', indexController.addQuestionForm);
router.post('/question/add', indexController.addQuestion);
router.put('/question/edit/:id', indexController.updateQuestion);
router.patch('/question/delete/:id', indexController.deleteQuestion);

module.exports = router;
