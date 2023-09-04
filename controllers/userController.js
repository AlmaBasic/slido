const { Pool } = require('pg');
const config = require('../config');
const nodemailer = require("nodemailer");
const fun = require('../helpers/functions');

const pool = new Pool(config);

exports.registrationForm = (req, res, next) => {
    res.render('user/registration', { title: 'Registration' });
};

exports.userRegistration = async function (req, res, next) {
    try {
        const person = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: fun.hashPassword(req.body.password),
            email: req.body.email,
            phone: req.body.phone,
        }

        await pool.query('INSERT INTO person (first_name, last_name, username, password, email, phone) VALUES ($1, $2, $3, $4, $5, $6)',
            [person.first_name, person.last_name, person.username, person.password, person.email, person.phone]);

        res.status(201).redirect("/login");
    } catch (e) {
        next(e);
    }
};

exports.dashboard = async (req, res, next) => {
    try {
        const user = JSON.parse(atob(req.cookies.token_login.split('.')[1]));

        const lectures = await pool.query(
            `SELECT l.id, l.name, l.all_questions, l.ans_questions FROM lecture l 
                WHERE is_active = true AND lecturer_id = $1 ORDER BY l.name asc;`, [user.user_id]
        );

        const questions = await pool.query(`SELECT * FROM question WHERE is_active = true ORDER BY id asc;`);

        const words = await pool.query(`SELECT * FROM illegal_word WHERE is_active = true ORDER BY id asc;`);

        res.render("user/dashboard", {
            title: "Dashboard",
            lectures: lectures.rows,
            questions: questions.rows,
            words: words.rows,
        });
    } catch (e) {
        next(e);
    }
};

exports.sortByAnsweredQuestions = async (req, res, next) => {
    try {
        const user = JSON.parse(atob(req.cookies.token_login.split('.')[1]));
        const lectures = await pool.query(`SELECT l.id, l.name, l.all_questions, l.ans_questions FROM lecture l
                WHERE is_active = true AND lecturer_id = $1 ORDER BY l.ans_questions desc;`, [user.user_id])
    } catch (e) {
        next(e);
    }
}

exports.sortByAnsweredStartTime = async (req, res, next) => {
    try {
        const user = JSON.parse(atob(req.cookies.token_login.split('.')[1]));
        const lectures = await pool.query(`SELECT l.id, l.name, l.all_questions, l.ans_questions, l.start_time FROM lecture l
                WHERE is_active = true AND lecturer_id = $1 ORDER BY l.start_time desc;`, [user.user_id])
    } catch (e) {
        next(e);
    }
}

/* LECTURE */
exports.addLectureForm = (req, res, next) => {
    res.render('user/lecture', { title: 'Add lecture' });
};

exports.lectureDetails = async (req, res, next) => {
    try{
        const id = req.params.id;
        const lecture = await pool.query(
            `SELECT l.id, l.name, TO_CHAR(l.start_time :: DATE, 'YYYY-MM-DD') as start_time, l.repeat_rule, l.cover_photo,
                TO_CHAR(l.end_time ::DATE, 'YYYY-MM-DD') as end_time, l.all_questions, l.ans_questions FROM lecture l
                WHERE is_active = true AND id = $1 ORDER BY l.name asc;`, [id]
        );

        const ans_questions = await pool.query(`SELECT * FROM question WHERE lecture_id = $1 AND is_active = true 
            AND status = true;`, [id]);

        const questions = await pool.query(`SELECT * FROM question WHERE lecture_id = $1 AND is_active = true 
            AND status = false AND is_hidden = false ORDER BY id;`, [id]);

        const hidden_questions = await pool.query(`SELECT * FROM question WHERE lecture_id = $1 AND is_active = true 
            AND is_hidden = true;`, [id]);

        res.render('user/lecture-dashboard', { title: 'Lecture', lecture: lecture.rows[0],
            ans_questions: ans_questions.rows, questions:questions.rows, hidden_questions: hidden_questions.rows});
    } catch (e) {
        next(e);
    }
};

exports.addLecture = async (req, res, next) => {
    try {
        const { lecture_name, start_time, end_time, repeat_rule, cover_photo } = req.body;
        const code = fun.generateCode();
        const user = JSON.parse(atob(req.cookies.token_login.split('.')[1]));

        await pool.query(
            `INSERT INTO lecture (name, start_time, end_time, repeat_rule, cover_photo, entry_code, lecturer_id) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [lecture_name, start_time, end_time, repeat_rule, cover_photo, code, user.user_id]);

        res.status(201).send("Lecture successfully created!");
    } catch (e){
        next(e);
    }
};

exports.updateLecture = async (req, res, next) => {
    try {
        const {lecture_id, name, start_time, end_time, repeat_rule} = req.body;

        await pool.query(`UPDATE lecture SET name = $2, start_time = $3, end_time = $4, repeat_rule = $5
            WHERE id = $1`, [lecture_id, name, start_time, end_time, repeat_rule]);

        res.send("Lecture successfully updated!");
    } catch (e){
        next(e);
    }
};

exports.deleteLecture = async (req, res, next) => {
    try {
        const lecture_id = req.body.lecture_id;

        await pool.query(`UPDATE lecture SET is_active = false WHERE id = $1`, [lecture_id]);
        res.send("Lecture successfully deleted!");
    } catch (e){
        next(e);
    }
};

/* QUESTION */
exports.answerQuestion = async (req, res, next) => {
    try{
        const question_id = req.params.id;

        await pool.query(`UPDATE question SET status = true WHERE id = $1`, [question_id]);
        const q = await pool.query(`SELECT * FROM question WHERE id = $1`, [question_id]);
        await pool.query(`UPDATE lecture SET ans_questions = ans_questions + 1 WHERE id = $1`, [q.rows[0].lecture_id]);

        res.send(q.rows[0]);
    } catch (e) {
        next(e);
    }
};

exports.hideQuestion = async (req, res, next) => {
    try{
        const question_id = req.params.id;

        await pool.query(`UPDATE question SET is_hidden = true WHERE id = $1`, [question_id]);
        const q = await pool.query(`SELECT * FROM question WHERE id = $1`, [question_id]);

        res.send(q.rows[0]);

    } catch (e) {
        next(e);
    }
};

/* ILLEGAL WORDS */
exports.addWordForm = (req, res, next) => {
    res.render('user/word', { title: 'Add illegal word' });
};

exports.addWord = async (req, res, next) => {
    try {
        const new_word = req.body.word;
        await pool.query(`INSERT INTO illegal_word(word) VALUES ($1) RETURNING *`, [new_word]);
        res.status(201).send("Illegal word successfully created!");;
    } catch (e){
        next(e);
    }
};

exports.updateWord = async (req, res, next) => {
    try {
        const {word_id, word} = req.body;
        await pool.query(`UPDATE illegal_word SET word = $2 WHERE id = $1`, [word_id, word]);
        res.send("Illegal word successfully updated!");
    } catch (e){
        next(e);
    }
};

exports.deleteWord = async (req, res, next) => {
    try {
        const word_id = req.body.word_id;
        await pool.query(`UPDATE illegal_word SET is_active = false WHERE id = $1`, [word_id]);
        res.send("Illegal word successfully deleted!");
    } catch (e){
        next(e);
    }
};

exports.getCode = async (req, res, next) => {
    try{
        const id = req.params.id;
        const result = await pool.query(`SELECT entry_code FROM lecture WHERE id = ${id};`);
        res.render('user/code', {title:'Entry code', entry_code: result.rows[0].entry_code});
    } catch (e) {
        next(e);
    }
};

exports.sendEmail = async (req, res, next) => {
    try{
        const mailTransporter = await nodemailer.createTransport({
            service: "gmail",
            auth:{
                user: "almabasic47@gmail.com",
                pass: ""
            }
        });
        const details = {
            from: "almabasic47@gmail.com",
            to: req.body.email,
            subject : "Lecture entry code",
            text: req.body.code,
        }
        await mailTransporter.sendMail(details,(err, info) => {
            if(err){
                console.log(err);
                return;
            }
            console.info("Mail send: " + info.response)

        });
        return res.status(200).send("Mail sent successfully!");
    } catch (e) {
        next(e);
    }
}