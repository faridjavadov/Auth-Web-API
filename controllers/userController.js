import { User } from "../models/User.js"


export const userController = {
    getAllData: async (req, res) => {
        const data = await User.find().then(data => {
            res.send(data).status(200);

        });

    }
}