const mongoose = require('mongoose');
const arrayValidator = require('mongoose-array-validator');
const PostSchema = new mongoose.Schema({
    postTitle: {
        type: String,
        required:[true,'Please Enter a Post Title'],
    },  
    postBody: {
        type: String,
        required:[true,'Please Provide post details '],
    },
    postPicture: {
        type: [String],
        default: undefined ,
        minItems: {
            value: 0,
            message: props => `Please upload at least one picture`
        },
        maxItems: {
            value: 1,
            message: props => `maxsimum number of pictures is 1`
        },
        },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }

},{timestamps:true});


PostSchema.plugin(arrayValidator)
module.exports = mongoose.model('Post',PostSchema)