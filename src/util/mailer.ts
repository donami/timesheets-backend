import nodemailer from 'nodemailer';
import * as templates from './mail-templates';

type MailOptions = {
  from?: {
    name: string;
    address: string;
  };
  to: string[]; // list of receivers
  subject: string; // Subject line
  text: string; // plain text body
  html: string; // html body
};

type MailAuth = {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
};

type MailTemplate = {
  subject: string;
  text: string;
  html: string;
};

type MailSendResponse = {
  ok: boolean;
  message: string;
  messageId?: string;
};

const mapMailOptions = (options: MailOptions) => {
  return {
    from: `"${options.from.name}" <${options.from.address}>`,
    to: options.to.join(', '),
    subject: options.subject,
    text: options.text,
    html: options.html,
  };
};

const SERVICE = 'gmail';
const USER = process.env.MAIL_USER;
const PASSWORD = process.env.MAIL_PASS;

const DEFAULT_FROM = {
  name: 'Timefly',
  address: USER,
};

class Mailer {
  credentials: MailAuth;
  mailOptions: MailOptions;
  templateMap = new Map([
    ['FORGOTTEN_PASSWORD', templates.forgottenPasswordMailTemplate],
  ]);

  constructor() {
    this.credentials = {
      service: SERVICE,
      auth: {
        user: USER,
        pass: PASSWORD,
      },
    };

    if (!this.credentials.auth.user || !this.credentials.auth.pass) {
      throw new Error('No mail credentials could be found!');
    }
  }

  configure(mailOptions: MailOptions) {
    this.mailOptions = mailOptions;

    if (!mailOptions.from) {
      this.mailOptions.from = DEFAULT_FROM;
    }
  }

  getTemplate = (name: string, ...args: any[]): MailTemplate => {
    if (!this.templateMap.has(name)) {
      throw new Error(`Unable to find mail template: ${name}`);
    }
    const template = this.templateMap.get(name);

    return template.call(this, ...args);
  };

  previewMail() {
    nodemailer.createTestAccount((err, account) => {
      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: account.user, // generated ethereal user
          pass: account.pass, // generated ethereal password
        },
      });

      if (!this.mailOptions) {
        throw new Error(
          'Mailer has not been configured with an options object.'
        );
      }

      const mailOptions = mapMailOptions(this.mailOptions);

      // const mailOptions = {
      //   from: '"John Doe" <johndoe@gmail.com>', // sender address
      //   to: 'janedoe@gmail.com, morgan@gmail.com', // list of receivers
      //   subject: 'Hello', // Subject line
      //   text: 'Hello world?', // plain text body
      //   html: '<b>Hello world?</b>', // html body
      // };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
  }

  send() {
    if (!this.mailOptions) {
      throw new Error('Mailer has not been configured with an options object.');
    }

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport(this.credentials);

    // setup email data
    const mailOptions = mapMailOptions(this.mailOptions);

    let response: MailSendResponse;

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        response = {
          ok: false,
          message: error.message || 'Something went wrong',
        };
      } else {
        response = {
          ok: true,
          message: 'Message sent',
          messageId: info.messageId,
        };
      }
    });

    return response;
  }
}

export default Mailer;
