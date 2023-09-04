const { Pool } = require('pg');
const config = require('../config');

const pool = new Pool(config);

exports.adminDashboard = async (req, res, next) => {
    try {
        const persons = await pool.query(
            `SELECT p.id, p.first_name, p.last_name, p.username, p.email, p.phone, TO_CHAR(p.blocked_until, 'DD/MM/YYYY') 
                as blocked_until FROM person p WHERE is_active = true ORDER BY p.first_name asc;`
        );

        const lectures = await pool.query(
            `SELECT l.id, l.name, TO_CHAR(l.start_time :: DATE, 'YYYY-MM-DD') as start_time, TO_CHAR(l.end_time ::DATE, 'YYYY-MM-DD') 
                as end_time, l.repeat_rule, l.cover_photo FROM lecture l WHERE is_active = true ORDER BY l.name asc;`
        );

        const questions = await pool.query(`SELECT q.text, q.id, q.lecture_id, l.name FROM question q 
            JOIN lecture l on q.lecture_id = l.id WHERE q.is_active = true ORDER BY q.id asc;`);

        const words = await pool.query(`SELECT * FROM illegal_word WHERE is_active = true ORDER BY id asc;`);

        res.render("admin/admin-dashboard", {
            title: "Admin Dashboard",
            persons: persons.rows,
            lectures: lectures.rows,
            questions: questions.rows,
            words: words.rows,
        });
    }catch (e){
        next(e);
    }
}

exports.addUserForm = (req, res, next) => {
    res.render('user/registration', { title: 'Add new user' });
};

exports.updateUser = async (req, res, next) => {
    try {
        const {person_id, role, first_name, last_name, username, email, phone} = req.body;

        if(role ==='admin') {
            const user = await pool.query(`UPDATE person SET first_name = $2, last_name = $3, username = $4, email = $5, 
                phone = $6 WHERE id = $1`, [person_id, first_name, last_name, username, email, phone]);
            res.send("User successfully updated!");
        } else {
            res.send("You are not allowed to update!")
        }

    }catch (e){
        next(e);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const {person_id, role} = req.body;

        if(role ==='admin') {
            const user = await pool.query(`UPDATE person SET is_active = false WHERE id = $1`, [person_id]);
            res.send("User successfully deleted!");
        } else {
            res.send("You are not allowed to delete!")
        }

    }catch (e){
        next(e);
    }
}

