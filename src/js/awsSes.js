const aswSes = (signupData) => {
    require('dotenv').config();
    let mailData = { errorMessage: '' };
    const letterBody = "<p>こんにちは、queaへご登録頂き、ありがとうございます。</p><p>下記の内容で仮登録を受け付けております。</p><p>Eメール：" + signupData.mail + "</p><p>本登録を確定するために、<a href='http://localhost:8080/?uid=" + signupData.uid + "'>こちらをクリックして</a>、ユーザー登録を完了してください。</p>";
    var AWS = require('aws-sdk');
    AWS.config.update(
        {
            credentials: new AWS.Credentials(
                process.env.VUE_APP_ACCESS_KEY,
                process.env.VUE_APP_SECRET_ACCESS_KEY
            ),
            region: process.env.VUE_APP_REGION
        }
    );
    var params = {
        Destination: {
            CcAddresses: [
                process.env.VUE_APP_SENDER_EMAIL,
            ],
            ToAddresses: [
                signupData.mail,
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: process.env.VUE_APP_CHARSET,
                    Data: letterBody,
                },
            },
            Subject: {
                Charset: process.env.VUE_APP_CHARSET,
                Data: 'quea 新規登録'
            }
        },
        Source: process.env.VUE_APP_SENDER_EMAIL,
        ReplyToAddresses: [
            process.env.VUE_APP_SENDER_EMAIL,
        ],
    };
    var sendPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
    sendPromise.then(() => {
    }).catch(
        () => {
            mailData.errorMessage = '後ほど、再度お試しください'
        });
    return mailData
}
export default aswSes
