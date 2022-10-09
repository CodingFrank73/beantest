

// +++ for AWS-Bucket +++
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const uuid = require("uuid").v4;
const path = require("path");


const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

// +++ general +++
const express = require("express");
const multer = require("multer");
const { body } = require("express-validator");

const { UserService } = require("../use-cases");


const userRouter = express.Router();

const s3 = new aws.S3({
    apiVersion: '2006-03-01',
    region,
    accessKeyId,
    secretAccessKey
});
// Needs AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY

const upload = multer({
    storage: multerS3({
        s3,
        bucket: 'cf73-test-upload',
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${uuid()}${ext}`);
        }
    }),
});

// Route für den AWS Upload und das Speichern des Bildpfads in MongoDB. --- PROFILE IMAGE --- 
userRouter.post('/myProfile/editImageProfile',
    upload.single('image'),
    // doAuthMiddleware,
    async (req, res) => {

        try {
            const s3FilePath = req.file.location;
            const userId = req.userClaims.sub;

            const user = await UserService.editAvatar({
                userId: userId,
                profileImage: s3FilePath
            })

            res.status(201).json(user)

        } catch (error) {
            console.log(error)
            res.status(500).json({ err: error.message || "Error during updating ProfileImage" })
        }
    });

// Route für den AWS Upload und das Speichern des Bildpfads in MongoDB. --- MAIN IMAGE --- 
userRouter.post('/myProfile/editImageMain',
    upload.single('image'),
    // doAuthMiddleware,
    async (req, res) => {

        try {
            const s3FilePath = req.file.location;
            const userId = req.userClaims.sub;

            const user = await UserService.editImageMain({
                userId: userId,
                bigImage: s3FilePath
            })

            res.status(201).json(user)

        } catch (error) {
            console.log(error)
            res.status(500).json({ err: error.message || "Error during updating MainImage" })
        }
    });

// ----------------------------------------------------------------------------------------------


userRouter.get("/all",
    // doAuthMiddleware,
    async (req, res) => {

        try {
            const users = await UserService.listAllUsers();

            res.status(200).json(users);

        } catch (error) {
            res.status(500).json({ err: error.message || "Unknown error while reading users" })
        }
    })

userRouter.get("/single/:id",
    async (req, res) => {
        try {

        } catch (error) {

        }
    })

userRouter.get("/myProfile",
    // doAuthMiddleware,
    async (req, res) => {

        try {
            const userId = req.userClaims.sub;
            // console.log("USER-ID:", userId);
            const user = await UserService.showMyProfile({ userId })

            res.status(200).json(user);

        } catch (error) {
            console.log(error)
            res.status(500).json({ err: { message: error ? error.message : "Unknown error while loading your profile." } })
        }
    })

userRouter.post("/location",
    async (req, res) => {
        try {
            const loc = await UserService.getLocation(req.body.latitude, req.body.longitude)

            res.status(201).json(loc)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message || "Unknown error while registering new user." })
        }
    })



userRouter.post("/register",
    upload.single('image'),
    // body("dogName").isString().isLength({ min: 2, max: 20 }),
    // body("email").isEmail(),
    // body("password").isStrongPassword(),
    // doValidation,
    async (req, res) => {

        try {
            const s3FilePath = req.file.location;
            const user = await UserService.registerUser({
                dogName: req.body.dogName,
                password: req.body.password,
                email: req.body.email,
                gender: req.body.gender,
                size: req.body.size,
                dateOfBirth: new Date(req.body.dateOfBirth),
                bigImage: s3FilePath
            })

            res.status(201).json(user)

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: error.message || "Unknown error while registering new user." })
        }
    })

userRouter.post("/refreshtoken",
    async (req, res) => {

        try {
            const result = await UserService.refreshUserToken({
                refreshToken: req.session.refreshToken || req.body.refreshToken
            })

            res.status(200).json(result);

        } catch (error) {
            res.status(500).json({ err: { message: error.message } })
        }
    })



userRouter.put("/myProfile/profileEditSettings",
    // doAuthMiddleware,
    async (req, res) => {

        try {
            // const userId = req.userClaims.sub;
            const user = await UserService.editProfileSettings(req.body)

            res.status(200).json({ user })

        } catch (error) {
            console.log(error)
            res.status(500).json({ err: error.message || "Error Editing Profile Settings." })
        }
    })

userRouter.put("/myProfile/editLanguage",
    // doAuthMiddleware,
    async (req, res) => {

        try {
            const userId = req.userClaims.sub;
            // console.log("userId aus router userClaims: " + userId, "req.body aus router:", req.body.language)

            const user = await UserService.editLanguage(userId, req.body.language)

            res.status(200).json({ user })
            // console.log("res.json aus route: ", { user })

        } catch (error) {
            console.log(error)
            res.status(500).json({ err: error.message || "Error editing language." })
        }
    })

userRouter.put("/myProfile/editMaxDistance",
    // doAuthMiddleware,
    async (req, res) => {

        try {
            const userId = req.userClaims.sub;
            // console.log("userId aus router userClaims: " + userId, "req.body aus router:", req.body.maxDistance)

            const user = await UserService.editMaxDistance(userId, req.body.maxDistance) //##

            res.status(200).json({ user })
            // console.log("res.json aus route: ", { user })

        } catch (error) {
            console.log(error)
            res.status(500).json({ err: error.message || "Error editing max distance." })
        }
    })

userRouter.put("/myProfile/ageRange",
    // doAuthMiddleware,
    async (req, res) => {

        try {
            const userId = req.userClaims.sub;
            const ageRangeArr = req.body;
            // console.log("TEST AgeRangeArr in Route ", ageRangeArr);
            const user = await UserService.editAgeRange(userId, ageRangeArr)

            res.status(200).json({ user })
            //console.log("res.json aus route: ", { user })

        } catch (error) {
            console.log(error)
            res.status(500).json({ err: error.message || "Error editing age range." })
        }
    })




module.exports = {
    userRouter
}

