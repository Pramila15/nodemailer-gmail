const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send',(req,res) => {
   // console.log(req.body)
   const output = `
   <p>You have a new contact request </p>
   <h1>Contact details </h1>
    <ul>
    <li>Name: ${req.body.name} </li>
    <li>Company: ${req.body.company} </li>
    <li>Email: ${req.body.email} </li>
    <li>Phone Number: ${req.body.phone} </li>
    <li>Message: ${req.body.message} </li>
    </ul>
   `;

   // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '',
        pass: ''
    }
    
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: 'FROM ADDRESS', // sender address
      to: 'TO ADDRESS', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  

})

app.listen(3000, () => console.log('Server started...'));