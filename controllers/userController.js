import { User } from "../models/User.js"
import { confirmCodeEmail } from "../utils/emailService.js";
import  jwt  from "jsonwebtoken";

export const userController = {
    getAllData: async (req, res) => {
        const data = await User.find().then(data => {
            res.send(data).status(200);

        });
    },
    userConfirm: async (req, res) => {
        try {
            const user = await User.find({ email: req.body.email, password: req.body.password, code: req.body.code })
            if (user.length > 0) {
                let token = jwt.sign({ email: req.body.email }, 'scooby')
                console.log(token);
                await User.findOneAndUpdate({ email: req.body.email }, {
                    isConfirm: true
                })
                res.status(200).send(token)
            }
            else {
                res.status(404).send({ 'msg': 'confirm code error' })
            }


        } catch (error) {
            res.status(500).send({ 'msg': 'internal server error' })
        }

    },
    login: async (req, res) => {
        try {
            const randomCode = Math.floor(Math.random() * 10000);
            const user = await User.find({ email: req.body.email })
            if (user.length > 0) {
                if ((await User.find({ email: req.body.email, password: req.body.password })).length>0) {
                    user.code = randomCode;
                    await User.findOneAndUpdate({ email: req.body.email, password: req.body.password }, {
                        code: randomCode
                    })
                    confirmCodeEmail(req.body.email, randomCode);
                    res.status(200).send('==>Confirm Code Phase')
                }
                else {
                    res.send('Your email or password is incorrect')
                }
            }
            else {

                res.send('Your email is not registered please go to Register page')
            }

        } catch (error) {
            console.log(error);
        }

    },
    register: async (req, res) => {
        try {
            const randomCode = Math.floor(Math.random() * 10000);
            const user = await User.find({ email: req.body.email })
            if (user.length > 0) {
                res.send('Your email is already registered')
            }
            else {
                await User.create({ email: req.body.email, password: req.body.password, code: randomCode })
                confirmCodeEmail(req.body.email, randomCode)
                res.send("User is Registered").status(200)
            }

        } catch (error) {
            console.log(error);
        }

    },
    forgetPassword: async (req, res) => {
        try {
            const randomCode = Math.floor(Math.random() * 10000);
            const user = await User.findOne({ email: req.body.email })
            if (user) {
                user.code = randomCode
                user.save();
                confirmCodeEmail(req.body.email, randomCode)
                res.send('Code is Sent')
            }
            else {
                res.send({ 'msg': 'email error' })
            }

        } catch (error) {
            console.log(error);
        }
    }
}