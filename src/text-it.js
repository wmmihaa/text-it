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
}

// This is the content that will be rendered
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

function validateInput(input, message) {
    // Validate that the sender only contains digits, characters and is not longer than 15 characters
    if (input === 'sender' && !message.match(/^[a-zA-Z0-9]{1,15}$/)) {
        console.log(`Invalid sender: ${message}`);
        res.status(400);
        res.send(nunjucks.render('index.html', content));
        return;
    }

    // Validate that the recipient is a valid phone number
    if (input === 'recipient' && !message.match(/^\+?[1-9]\d{1,14}$/)) {
        console.log(`Invalid recipient: ${recipient}`);
        res.status(400);
        res.send(nunjucks.render('index.html', content));
        return;
    }

    // Validate that the message is not empty and not longer than 160 characters
    if (input === 'text_message' && (!message || message.length > 160)) {
        console.log(`Invalid text_message: ${message}`);
        res.status(400);
        res.send(nunjucks.render('index.html', content));
        return;
    }
    return;
}

// Render the index page
app.get('/', (req, res) => {
    res.status(200);
    res.send(nunjucks.render('index2.html', content));
});

// Retrieve the form data and send the message to twilio
app.post('/send', (req, res) => {
    for (var key in req.body) {
        validateInput(key, req.body[key]);
    }

    var sender = req.body.sender;
    var recipient = req.body.recipient;
    var text_message = req.body.text_message

    const client = require('twilio')(accountSid, authToken);
    client.messages
        .create({
            body: text_message,
            to: recipient,
            from: sender
        })
        .then((message) => console.log(message));

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
