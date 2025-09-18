import bcrypt from 'bcryptjs';
import pool from '../db.js';
import JWT from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
export const SignUp = async (req, res) => {
    const { username, mail, aadar, department, state, district, password } = req.body;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE mail = $1', [mail]);
        if (userExists.rows.length > 0) {
            return res.json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            'INSERT INTO users (username, mail, aadar, department, state, district, password) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [username, mail, aadar, department, state, district, hashedPassword]
        );
        const token = JWT.sign({ mail }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ message: 'User registered successfully', token });
    } catch (err) {
        res.json({ message: 'Server error', error: err.message });
    }
}

export const SignIn = async (req,res) =>
{
    const {mail,password} = req.body;
    try
    {
        const userExists = await pool.query('SELECT * FROM users WHERE mail = $1',[mail]);
        if(userExists.rows.length === 0)
        {
            return res.json({message:'User does not exist'});
        }
        const user = userExists.rows[0];
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.json({message:'Invalid credentials'});
        }
        const token = JWT.sign({mail},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
        res.json({message:'Login successful',token});
    }
    catch(err)
    {
        res.json({message:'Server error',error:err.message});
    }
}