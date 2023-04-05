import { createTransport } from "nodemailer";

export default class EmailService {

    private config
    constructor(
        public to?: string,
        public subject?: string,
        public message?: string) {

        this.config = {
            host: process.env.EMAIL_HOST ?? "",
            port: process.env.EMAIL_PORT ?? 578,
            user: process.env.EMAIL_USER ?? "",
            password: process.env.EMAIL_PASSWORD ?? ""
        }
    }


    sendMail() {

        let mailOptions = {
            from: `MovieAPI <${this.config.user}>`,
            to: this.to,
            subject: this.subject,
            text: this.message
        };

        const transporter = createTransport({
            host: this.config.host,
            port: 587,
            secure: false,
            auth: {
                user: this.config.user,
                pass: this.config.password
            },
            tls: { rejectUnauthorized: false }
        });


        console.log(mailOptions);

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error("Has error")
                console.info(error)

                return error;
            } else {
                console.info("Email enviado")
                return "E-mail enviado com sucesso!";
            }
        });
    }

}