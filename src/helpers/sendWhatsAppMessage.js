
import fetch from "node-fetch";

export default class sendWhatsAppMessage {

    static sendMessage(message, number) {

        try {


            console.log("Enviando mensaje")
            const accountSid = 'ACc7f3a590507c3b9aa8d72fcda345299c';
            const authToken = '64d7c291819506a1cd73a5e024843110';
            const client = require('twilio')(accountSid, authToken);

            client.messages
                .create({
                    body: message,
                    from: 'whatsapp:+14155238886',
                    to: `whatsapp:+506${number}`
                })
                .then(message => console.log(message.sid))
        } catch (e) {
            console.log(e)
        }

        // let botId = '103305209450406';
        // let phoneNbr = '50685465958';
        // let bearerToken = 'EAAIZBDy3n6VUBAEGBEb4CkzY7jQTQ9ugMH6idI71cNMBK22fnqrqMk4Of38KWrAX4VCcCAZBamoTza5kyWOq1ZB5WSb6yEEG957v5PYCXI8DZCNrtA1Y8mC1wwM0EnIooRDkHgN8Pm4P6ZB0lxWPGR9yH9QIRtKWTL4PDzXmYPtEXedQUqKEIfv86K3ZBLI01iWhmhWDx8xQZDZD';

        // let url = 'https://graph.facebook.com/v16.0/' + botId + '/messages';
        // let data = {
        //     messaging_product: 'whatsapp',
        //     to: phoneNbr,
        //     type: 'template',
        //     template: {
        //         name: 'hello_world',
        //         language: { code: 'en_US' }
        //     }
        // };

        // let postReq = {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': 'Bearer ' + bearerToken,
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data),
        //     json: true
        // };

        // fetch(url, postReq)
        //     .then(data => {
        //         return data.json()
        //     })
        //     .then(res => {
        //         console.log(res)
        //     })
        //     .catch(error => console.log(error));
    }
}




// const accountSid = 'AC569e9ea864052b8b315616cd1c40acce';
// const authToken = '[AuthToken]';
// const client = require('twilio')(accountSid, authToken);

// client.messages
//     .create({
//         body: 'Your appointment is coming up on July 21 at 4PM',
//         from: 'whatsapp:+14155238886',
//         to: 'whatsapp:+50685465958'
//     })
//     .then(message => console.log(message.sid))
//     .done();