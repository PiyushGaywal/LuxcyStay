const mongoose=require('mongoose')
require('dotenv').config();
const Url=process.env.mongoUrl
const db=mongoose.connect(Url).
then(()=>{console.log('Connect To Database Success');
})
.catch((err)=>{console.log("An Error Occured",err);
})
module.exports=db