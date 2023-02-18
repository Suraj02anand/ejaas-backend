require("dotenv").config()
const express = require("express")
const nodemailer = require("nodemailer")
const bodyParser = require("body-parser")
const cors = require("cors")

const app = express()


app.use(express.json())
app.use(bodyParser())
app.use(cors())

app.get("/" , (req,res) => {
    res.status(200).send("Backend for mailer is up & running...");
})



app.post("/sendMail" , (req,res) => {


    let status = false;

    console.log('Response : ', req.body);
    const { name , phone, email , message} = req.body;

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth : {
            user: process.env.gmail_id,
            pass: process.env.gmail_app_pass,
        }
    })

    // Sends to One who Submits
    transporter.sendMail({
        from: "suraj02anand@gmail.com",
        to: req.body.email,
        subject: "Thanks for Filling up the form",
        html : `
                <h3>Hi ${req.body.name}!</h3>
                <p>Thanks for filling up the form</p>
                <p>Will Get in touch with you soon.</p>
                <p>Have a nice day ${req.body.name}.</p>
            `
    } , 
        (err,info) => {
            console.log("sending....")
            if(err){
                status = false;
                console.log("failed :(")
                console.log(err)
            }
            else{
                status = true;
                console.log("Sent :)")
                console.log(info)
            }
        })

    // Sends to Admin
    transporter.sendMail({
        from: "suraj02anand@gmail.com",
        to: "ejazahmed4688@gmail.com",
        subject: "You've got a new response",
        html : `
                <p> From: ${name}</p>
                <p> Phone: ${phone} </p>
                <p> Email: ${email} </p>
                <p> Message: ${message} </p>
            `
    } , 
        (err,info) => {
            console.log("sending....")
            if(err){
                console.log("failed :(")
                console.log(err)
            }
            else{
                console.log("Sent :)")
                console.log(info)
            }
        })

        if(status){
            res.status(200).json({"message" : "Mail Sent Successfully", "status" : true})
        }
        else{
            res.status(400).json({"message" : "Something went wrong !!!", "status" : false});
        }

})

app.listen( process.env.PORT || 8000 , () => {
    console.log('Server is up and running...')
})