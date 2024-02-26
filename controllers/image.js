const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key 11218cc1a13d4caf9a9650c5e2a4c854")

// const Clarifai = require('clarifai');

// const app = new Clarifai.App({
//     apiKey: '11218cc1a13d4caf9a9650c5e2a4c854'
// });
const handleApiCall = (req, res) => {
    stub.PostModelOutputs(
        {
            model_id: "face-detection",
            inputs: [{data: {image: {url: req.body.input}}}]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log("Error" + err);
                return;
            }

            if (response.status.code !=10000) {
                console.log("Received failed status:" + response.status.description + '/n' + response);
                return;
            }

            console.log("Predicted concepts with confidence values:")
            for (const c of response.outputs[0].data.concepts) {
                console.log(c.name + ": " + c.value);
            }
            res.json(response)
        }
    );
}

    // .then(data => {
    //     res.json(data);
    // })
    // .catch(err => res.status(400).json('unable to work with API'))


const handleImage = (req, res, db) => {
    const { id }  = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}