const { Pool } = require('pg');
const config = require('../config');
const jwt = require("jsonwebtoken");
const fun = require('../helpers/functions');

const pool = new Pool(config);

exports.landingPage = (req, res, next) => {
    res.render('index', {title: 'Slido'});
};

exports.loginPage = (req, res, next) => {
    res.render('login', { title: 'Login' });
};

exports.sendToken = (req, res, next) => {
    //console.info("Uspjesan login");
    //console.info(req.user);
    //let token = JSON.stringify(req.korisnik);

    let token = jwt.sign(req.user, 'kljuc');
    //console.info(token)
    res.cookie('token_login', token);
    if(req.user.admin === true){
        return res.redirect('./admin');
    }
    //console.log(req.user.user_id)
    return res.redirect('./users');
};

exports.logout = (req, res, next) => {
    return res.clearCookie("token_login").status(200).redirect("/login");
};

exports.checkLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await pool.query('SELECT * FROM person WHERE username = $1', [username])

        if (user.rows.length == 0) {
            return res.send(401).send('Wrong credentials!');
        }
        if(await fun.checkPassword(password, user.rows[0].password)){
            if(new Date() <= user.rows[0].blocked_until){
                return res.status(403).send(`Admin blocked you until ${user.rows[0].blocked_until}.`)
            }

            req.user = {
                user_id: user.rows[0].id,
                username: user.rows[0].username,
                first_name: user.rows[0].first_name,
                last_name:user.rows[0].last_name,
                admin: user.rows[0].is_admin,
            }
            next();
        } else {
            return res.status(401).send('Wrong credentials!');
        }
    } catch(e) {
        next(e)
    }
};

// Lecture
exports.enterLecture = async (req, res, next) => {
    try{
        const code = req.body.code;

        const lecture = await pool.query(`SELECT * FROM lecture WHERE entry_code = $1 AND is_active = true`, [code]);
        const questions = await pool.query(`SELECT * FROM question WHERE lecture_id = $1 AND is_active = true 
            AND is_hidden = false;`, [lecture.rows[0].id]);

        res.render('guest/lecture-guest', {title: lecture.rows[0].name, lecture: lecture.rows[0],
            questions: questions.rows, lecture_id: lecture.rows[0].id});
    } catch (e) {
        next(e);
    }
};

exports.rateLecture = async (req, res, next) => {
    try{
        const id = req.body.lecture_id;
        const rate = req.body.rate;

        const lecture = await pool.query(`INSERT INTO lecture_mark(mark_id, lecture_id) VALUES ($1, $2) RETURNING *`, [rate, id]);
        res.send(lecture.rows);
    } catch (e) {
        next(e);
    }
};

// Question
exports.addQuestionForm = async (req, res, next) => {
    try {
        const lectures = await pool.query(`SELECT name, id FROM lecture WHERE is_active = true;`);
        res.render('guest/question', { title: 'Ask question', lectures: lectures.rows });
    } catch (e) {
        next(e);
    }
};

exports.addQuestion = async (req, res, next) => {
    try {
        const new_question = req.body.question;
        const lecture_id = req.body.lecture_id;
        await pool.query(`INSERT INTO question(text, lecture_id) VALUES ($1, $2) RETURNING *`, [new_question, lecture_id]);
        await pool.query(`UPDATE lecture SET all_questions = all_questions + 1 WHERE id = $1;`, [lecture_id]);
        res.status(201).send("Question successfully created!");;
    } catch (e){
        next(e);
    }
};

exports.updateQuestion = async (req, res, next) => {
    try {
        const {question_id, text} = req.body;
        await pool.query(`UPDATE question SET text = $2 WHERE id = $1 `, [question_id, text]);
        res.send("Question successfully updated!");
    } catch (e){
        next(e);
    }
};

exports.deleteQuestion = async (req, res, next) => {
    try {
        const question_id = req.body.question_id;
        await pool.query(`UPDATE question SET is_active = false WHERE id = $1`, [question_id]);
        res.send("Question successfully deleted!");
    } catch (e){
        next(e);
    }
};

exports.likeQuestion = async (req, res, next) => {
    try{
        const id = req.body.question_id;

        const question = await pool.query(`UPDATE question SET num_of_likes = num_of_likes + 1 WHERE id = $1 AND is_active = true 
            RETURNING *`, [id]);

        res.send(question.rows);
    } catch (e) {
        next(e);
    }
};
