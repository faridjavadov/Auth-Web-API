import express from 'express'
import { userController } from '../controllers/userController.js';

export const userRoutes = express.Router();

userRoutes.get('/',userController.getAllData)
