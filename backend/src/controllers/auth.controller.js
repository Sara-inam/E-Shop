import bcrypt from 'bcrypt';
import logger from '../config/logger.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import config from '../../config.js';

import { validateLogin, validateSignup } from '../validator/auth.validator.js';
import mongoose from 'mongoose';


export const signup = async (req, res) =>{
    const session = await mongoose.startSession();
  session.startTransaction();
    try{
        const errors = validateSignup(req.body);
        if(errors.length > 0) return res.status(400).json({message: errors})
        const {name, email, phone, gender, password} = req.body;
        const existingUser = await User.findOne({email}).session(session);
        if(existingUser){
            await session.abortTransaction();
           session.endSession();
            return res.status(400).json({message: "Email already exist"});}
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            phone,
            gender,
            password: hashedPassword,
        });
        await newUser.save({session});
        await session.commitTransaction();
        session.endSession();
         res.status(200).json({ message: "User registered successfully" });

    }catch (err) {
     await session.abortTransaction(); 
     session.endSession();
    console.error(err);
    res.status(500).json({ message: ["Server error"] });
  }
};


export const login = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  try {
   
    const errors = validateLogin(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).session(session);
    if (!user) {
        await session.abortTransaction();
           session.endSession();
      return res.status(404).json({ message: "You are not registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        await session.abortTransaction();
           session.endSession();
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.EXPIRE_IN, }
    );
    await session.commitTransaction();
           session.endSession();


    res.status(200).json({
      message: `${user.role} login successful`,
      user: {
        
        email: user.email,
        role: user.role,
      
      },
      token,
    });

    logger.info(`${user.role} logged in: ${user.email}`);

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Error:", error); 
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};