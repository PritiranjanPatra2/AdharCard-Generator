import express from 'express';
import multer from 'multer';

import { v2 as cloudinary } from 'cloudinary';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import cloud from './clou.js';
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const PORT=process.env.PORT;
const API=process.env.CLOUDNAME;
const API_KEY=process.env.API_KEY;
const API_SECRET=process.env.API_SECRET;
// console.log(API,API_KEY,API_SECRET,PORT);

cloudinary.config({ 
  cloud_name: API, 
  api_key: API_KEY, 
  api_secret:API_SECRET 
});

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


app.post('/submit-form', upload.single('image'), async (req, res) => {
  const { fullName, dob, aadharNumber, gender, fatherName, address } = req.body;

const img= await cloud(req.file.buffer);

const imageUrl= img.secure_url; 
 

  res.json({
    data: {
      fullName,
      dob,
      aadharNumber,
      gender,
      fatherName,
      address,
      imageUrl,  
    },
  });
});

  

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
