const vision = require('@google-cloud/vision');
const sizeOf = require("image-size");
const fs = require ('fs');

const uploadLocation="./testimages/";
const fname = "testimage.jpg" //Test image

var config = {credentials:
    {
        client_email:process.env.GOOGLE_API_EMAIL,
        private_key:Buffer.from(process.env.GOOGLE_API_KEY, 'base64').toString('ascii'),
    }
};

async function facelandmark(req, res, next) {
    const client = new vision.ImageAnnotatorClient(config);
    //test for upload - needed for encode
    var imageFileUpload = fs.readFileSync(uploadLocation+fname);
    //defines internal file 
    var imageB64Upload = Buffer.from(imageFileUpload).toString('base64');
    const request = {
        image: {
            content: Buffer.from(imageB64Upload, 'base64')
        }
    };  
    let originalImageSize = sizeOf(uploadLocation+fname);
    let imageInformation;
    async function setEndpoint() {
        try{
            const result = await client.faceDetection(request);
            imageInformation = result;
            console.log(result)
        } catch(error) {
            console.log(error);
            return res.status(500).json(`problem with the Google API`);
        }
    }
    await setEndpoint();

    return {imageInformation, originalImageSize}
}

module.exports = {
    facelandmark
}