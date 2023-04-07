const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `Admin <${process.env.SENDGRID_FROM}>`;
  }

  _initTransport() {
    return nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USERNAME,
        pass: process.env.SENDGRID_APIKEY,
      },
    });

    // TODO:
    // return nodemailer.createTransport({
    //   service: "smtp.sendgrid.net",
    //   port: 465,
    //   auth: {
    //     user: process.env.SENDGRID_USERNAME,
    //     pass: process.env.SENDGRID_APIKEY,
    //   },
    // });
  }

  async _send(template, subject) {
    const html = pug.renderFile(
      path.join(__dirname, "..", "views", "emails", `${template}.pug`),
      {
        name: this.name,
        url: this.url,
        subject,
      }
    );

    const emailConfig = {
      from: this.from,
      to: this.to,
      // html,
      text: convert(html),
    };

    await this._initTransport().sendMail(emailConfig);
  }

  async sendRegister() {
    await this._send("register", "Welcome to our great service!!!");
  }
};
