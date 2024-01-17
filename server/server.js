const dotenv = require('dotenv');
dotenv.config();

const express = require('express')
const multer = require('multer')
const app = express()
const { PrismaClient } = require('@prisma/client')
const cors = require('cors');
const crypto = require('crypto');
const prisma = new PrismaClient();
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
s3Region = process.env.S3_REGION
s3Bucket = process.env.S3_BUCKET

const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const s3 = new S3Client({
    region: s3Region,
    credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey
    }
});

upload.single('frame');

app.use(express.json());
app.use(cors());

app.get("/api/detects", async (req, res) => {
    const {page} = req.query;
    const perPage = 5;
    const skip = (page - 1) * perPage;
    const detectedFrames = await prisma.Detected_Frames.findMany({ 
        orderBy: [{ timestamp: 'desc' }] ,
        take: perPage,
        skip: skip
    })
    for (const detectedFrame of detectedFrames){
        const getObjectParams = {
            Bucket: s3Bucket,
            Key: detectedFrame.image_url,
        }
        const command = new GetObjectCommand(getObjectParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        detectedFrame.image_url = url;
    }
    res.send(detectedFrames);
});

app.get("/api/marker", async (req, res) => {
    const detectedMarkers = await prisma.Detected_Frames.findMany({ 
        orderBy: [{ timestamp: 'desc' }] ,
    })
    res.send(detectedMarkers);
});

app.post("/api/detects", upload.single('image'), async (req, res) => {
    const imageName = randomImageName();
    const command = new PutObjectCommand({
        Bucket: s3Bucket,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: 'image/png'
    });
    await s3.send(command)

    const post = await prisma.Detected_Frames.create({
        data: {
            category: 1,
            lng: 40,
            lat: 50,
            image_url: imageName
        }
    });

    res.send({});
});

app.listen(8080, () => console.log("Server listening on port 8080"));