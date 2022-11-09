const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { upLoadImage } = require("./helpers/uploadFiles");

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use(cors());

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
    })
);

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: true,
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", async (req, res) => {
    try {
        const nombreImagen = await upLoadImage(req.files, "images");
        res.status(200).json({
            mensaje: "File has been uploaded",
            nombreImagen,
        });
    } catch (error) {
        console.log(error);
    }
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.get("/", (req,res)=>{
    res.status(200).json({
        mesagge:"You api is ready...."
    })
});
app.listen("5000", () => {
    console.log("Backend is running.");
});
