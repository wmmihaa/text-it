const path = require('path');
const nunjucks = require('nunjucks');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Added support for static files
app.use("/js", express.static(__dirname + '/js'));
app.use("/styles", express.static(__dirname + '/styles'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Added relative path
nunjucks.configure(path.resolve(__dirname, 'templates'), {
    autoescape: true,
    express: app
});
const accountSid = process.env.twilioAccountSid;
const authToken = process.env.twilioAuthToken;
if (!accountSid || !authToken) {
    console.log('Failed to read twilio credentials from environment, exiting.');
    process.exit(1)
} else {
    console.log(`Will login as: ${accountSid}`);
    const client = require('twilio')(accountSid, authToken);
}

const content = {
    title: 'Text-it',
    message: 'Text it application',
    forms: [
        {
            title: 'Send a message',
            sender: 'Sender',
            recipient: 'Recipient',
            message: 'Message'
        }]
};

app.get('/', (req, res) => {
    console.log(req.query)
    res.status(200);
    res.send(nunjucks.render('index2.html', content));
});

app.post('/send', (req, res) => {
    var sender = req.body.sender;
    var recipient = req.body.recipient;
    var message = req.body.text_message
    console.log(req.body);
    res.status(200);
    res.send(nunjucks.render('index.html', content));
});

// Added a new send method. This method always return 200, but the payload may hold
// error message. This is usualy how I do it as I want to manage exception on back-end.
app.post('/sendMessage', (req, res) => {
    try {
        const model = req.body;
        client.messages
            .create({
                body: model.message,
                to: model.recipient,
                from: model.sender
            })
            .then((message) => {
                res.send(message);
            })
            .catch(error=>{
                res.send({error: error}); 
            });
    }
    catch (e) {
        res.send({error: 'General exception, unable to send message'}); 
    }
});

app.listen(3001, () => {
    console.log('Listening on 3001');
});

