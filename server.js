"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const app = express_1.default();
const cors_1 = __importDefault(require("cors"));
require("dotenv").config();
// middleware
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(express_1.default.static("dist"));
let transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        // type: "OAuth2",
        user: process.env.EMAIL,
        pass: process.env.WORD,
        // clientId: process.env.OAUTH_CLIENTID,
        // clientSecret: process.env.OAUTH_CLIENT_SECRET,
        // refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    },
});
transporter.verify((err, success) => {
    err
        ? console.log(err)
        : console.log(`=== Server is ready to take messages: ${success} ===`);
});
app.post("/send", function (req, res) {
    let mailOptions = {
        from: `${req.body.data.email}`,
        to: process.env.EMAIL,
        subject: `Message from: ${req.body.data.email}`,
        text: `${req.body.data.message}`,
    };
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            res.json({
                status: "fail",
            });
        }
        else {
            console.log("== Message Sent ==");
            res.json({
                status: "success",
            });
        }
    });
});
const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
