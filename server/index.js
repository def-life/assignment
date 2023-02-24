const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
const { generateRandomImgNames } = require("./Utils/utilites");
const { default: corsOptions } = require("./Configurations/configureCors");
const Products = require("./Model/ProductSchema");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

dotenv.config();

const maxFiles = 6;

const s3_bucket = process.env.S3_BUCKET;
const secret_key = process.env.SECRET_KEY;
const bucket_region = process.env.BUCKET_REGION;
const access_key = process.env.ACCESS_KEY;

const client = new S3Client({
  credentials: {
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  },
  region: bucket_region,
});

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors(corsOptions));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DATABASE_URL, () => {
  console.log("connected to mongodb");
});

app.post("/api/products", upload.array("files"), async (req, res, next) => {
  console.log(req.files);
  const { name, description, price } = req.body;

  const requests = [];
  const keys = [];
  req.files.forEach(async (file, i) => {
    const key = generateRandomImgNames();
    keys.push(key);

    const params = {
      Bucket: s3_bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    requests.push(client.send(command));
  });

  const results = await Promise.allSettled(requests);
  results.forEach((result) => {
    console.log(result);
  });

  const product = new Products({ name, description, price, files: keys });
  const result = await product.save();
  console.log(result);

  // TODO: a way to send all request at once as a transaction
  // if one fail to upload all should

  res.json({ product });
});

app.get("/api/products", async (req, res) => {
  // limiting the number of products to 8
  const products = await Products.find({}).limit(8).lean();
  const requests = [];
//   const newProducts = [];
  console.log(JSON.stringify(products), "hi")

 for(let product of products) {
    const command = new GetObjectCommand({ Bucket: s3_bucket, Key: product.files[0] });
    requests.push(getSignedUrl(client, command, { expiresIn: 3600 }));
    // newProducts.push(product._doc);

  }

  const results = await Promise.allSettled(requests);
  


  results.forEach((result, index) => {
    // newProducts[index].url = result.value;
    products[index].url = result.value;
  });

  

  res.json(products);
});

app.listen(PORT, () => {
  console.log("listening at port", PORT);
});


