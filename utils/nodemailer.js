import nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper

// create reusable transporter object using the default SMTP transport

const nodemailerTransport = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	secure: false, // true for 465, false for other ports
	auth: {
		user: 'tmtwns@gmail.com', // generated ethereal user
		pass: 'gvqddglklpbyqeqn', // generated ethereal password
	},
});

export default nodemailerTransport;
