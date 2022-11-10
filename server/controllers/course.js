import AWS from 'aws-sdk'
import Course from '../models/course.js'
import {nanoid} from 'nanoid'
import slugify from 'slugify'

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
};

const S3=new AWS.S3(awsConfig)

export const imageUpload=async(req,res)=>{
    console.log(req.body)
    try {
        const {image}=req.body;
        if(!image) return res.status(400).send("No Image")
        
        //prepare  the image
        const base64Data=new Buffer.from(
            image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
        );
        const type=image.split(";")[0].split("/")[1];

        //image params
        const params={
            Bucket:process.env.BUCKET_NAME,
            Key:`${nanoid()}.${type}`,
            Body:base64Data,
            ACL:"public-read",
            ContentEncoding:"base64",
            ContentType:`image/${type}`
        }
        S3.upload(params,(err,data)=>{
            if(err){
                console.log("errror",err);
                return res.sendStatus(400);
            }
            console.log("data",data);
            res.send(data)
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send("Error,imageUpload")
    }
}
export const removeImage=async(req,res)=>{
    try {
        const {image}=req.body;
        const params={
            Bucket:process.env.BUCKET_NAME,
            Key:image.Key,
        }
        S3.deleteObject(params,(err,data)=>{
            if(err){
                console.log("error-removwe Image",err);
                res.sendStatus(400)
            }
            res.send({ok:true})
        })
        
    } catch (error) {
        console.log(error)
        return res.status(400).send("Error,imageUpload")
    }
}

export const create=async(req,res)=>{
    // console.log("CREATE COURSE", req.body);
  // return;
  try {
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.name.toLowerCase()),
    });
    if (alreadyExist) return res.status(400).send("Title is taken");

    const course = await new Course({
      slug: slugify(req.body.name),
      instructor: req.user,
      ...req.body,
    }).save();
    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Course create failed. Try again.");
  }
}

export const read = async (req, res) => {
    try {
      const course = await Course.findOne({ slug: req.params.slug })
        .populate("instructor", "_id name")
        .exec();
      res.json(course);
    } catch (err) {
      console.log(err);
    }
  };