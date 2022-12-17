const sgMail = require('@sendgrid/mail');

const API_KEY = "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";
sgMail.setApiKey(API_KEY);

const msg = {
    to: 'harek4260ground@yahoo.co.jp',
    from: 'suteaka9470@yahoo.co.jp',
    subject: 'test mail from sg',
    text: 'hoge hoge',
    html: '<p>foo bar</p>'
}
console.log(sgMail);
sgMail.send(msg).catch(e => console.log(e));