const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const Schema = mongoose.Schema

const CandidateSchema = new Schema({
    
    name : {
        type : String,
        required : [true,"Lütfen bir isim girin."]
    },

    email : {
        type: String,
        required : [true, "Lütfen email girin"],
        unique : true,
        match : [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Lütfen geçerli bir email girin"]
    },

    no : {
        type: Number,
        required : [true, "Lütfen telefon No girin"]
    },

    profile_image : {
        type : String,
        default : "default.jpg"
    },


    about : [
        {
            type : String
        }
    ],

    alarmNote : String,

    title : String,

    content: String,

    website : String,

    place : String,

    linkedin : String,

    slug : String,

    cretedAt : {
        type : Date,
        default : Date.now
    },

    alarm : {
        type : Date,
    },

    user : {
        type : mongoose.Schema.ObjectId,
        required : true,
        ref : "User"
    },

    accepted : [
        {
            type : mongoose.Schema.ObjectId,
            ref : "User"
        }
    ]

})


CandidateSchema.pre("save",function (next) {

    if (!this.isModified("name")) {
        next()
    }
    this.slug = this.makeSlug()
    next()
});


CandidateSchema.methods.makeSlug = function () {
    return slugify(this.name,{
        replacement : "_",
        remove : /[*+~.()'"!:@]/g,
        lower : true
    })
}

module.exports = mongoose.model("Candidate",CandidateSchema)