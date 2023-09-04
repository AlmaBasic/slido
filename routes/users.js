const userController = require("../controllers/userController");
const express = require('express');
const router = express.Router();

/* USER */
router.get('/', userController.dashboard);
router.get('/registration', userController.registrationForm);
router.post('/registration', userController.userRegistration);

/* LECTURE */
router.get('/lecture', userController.addLectureForm);
router.get('/lecture/:id', userController.lectureDetails);
router.post('/lecture/add', userController.addLecture);
router.put('/lecture/edit/:id', userController.updateLecture);
router.patch('/lecture/delete/:id', userController.deleteLecture); // soft delete

/* QUESTION */
router.patch('/lecture/question/answer/:id', userController.answerQuestion);
router.patch('/lecture/question/hide/:id', userController.hideQuestion);

/* ILLEGAL WORD */
router.get('/word', userController.addWordForm);
router.post('/word/add', userController.addWord);
router.put('/word/edit/:id', userController.updateWord);
router.patch('/word/delete/:id', userController.deleteWord); // soft delete

/* ENTRY CODE */
router.get('/code/:id', userController.getCode);
router.post('/send-email', userController.sendEmail);

module.exports = router;
