const mongoose=require("mongoose");

const PinSchema=new mongoose.Schema({
    username:{
        type:string,
        require: true,
        
    },
    title:{
        type:string,
        require:true,
        min:3,
    },
    desc:{
        type:string,
        require=true,
        
    },
    rating:{
        type:Number,
        require:true,
        min:0,
        max=5,
    },
    lat:{
        type:Number,
        require:true
    },
    long:{
        type:Number,
        require:true
     
    }},
    {timestamps:true}
);

module.exports=mongoose.model("Pin", PinSchema);