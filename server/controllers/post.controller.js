const Post = require('../models/post.model');
const Picture = require('../models/picture.model')
var fs = require('fs');


module.exports = {

    createPost: async (req, res) => {
        try{
        const postPic = req.file.filename
        const postedBy = req.jwtpayload.id
        let ps = req.body
        ps.postPicture = postPic
        ps.postedBy = postedBy
        const newP = await Post.create(ps)
        console.log(newP,'this is my P')

        const profileImageToDB = {
            pictureFileName:req.file.filename,
            pictureByUser:req.jwtpayload.id,
            pictureOnPost:newP._id.toString()
        }
        console.log(profileImageToDB ,' my pic object')
        const pushToPicsDB = await Picture.create(profileImageToDB)
        res.json(newP)

    }
        catch(err) {
            res.json(err)
        }

    },    

    getAllPosts: (req, res) => {
        Post.find({})
            .then(allPosts => {
                res.json(allPosts)
            })
            .catch(err => {
                res.json({message: 'Something went wrong: ', error: err})
            });
    },

    getAllPostsByUserId: (req, res) => {
        Post.find({postedBy : req.params.id} )
            .then(allPosts => {
                res.json(allPosts)
            })
            .catch(err => {
                res.json({message: 'Something went wrong: ', error: err})
            });
    },

    getOnePost: (req, res) => {
        Post.findOne({_id: req.params.id})
            .then(onePost => {
                res.json(onePost)
            })
            .catch(err => {
                res.json({message: 'Something went wrong: ', error: err})
            });
    },

// updatePost: (req, res) => {
    //     Post.findOneAndUpdate( {_id: req.params.id}, req.body, {runValidators: true, new: true}
    //         )
    //         .then(updatedPost => {
    //             res.json(updatedPost)
    //         })
    //         .catch(err => {res.status(400).json(err)
    //             console.log(err)
    //         })
    // },
    updatePost: async (req, res) => {
        try{
            const getCreaterId = await Post.find({_id: req.params.id})
            const creatorId = getCreaterId[0].postedBy.toString()
            if (req.jwtpayload.id != creatorId ){
                console.log("You are not authorized to update this post")
                return
            }
            else{
                console.log("Update Post contents: " + JSON.stringify(req.body))
                const postUpdate = await Post.findOneAndUpdate({_id: req.params.id}, req.body, {runValidators: true, new: true})
                console.log(postUpdate)
                res.json(postUpdate)
            }
        }
        catch(err){
            console.log("something went wrong updating the post")
            res.status(400).json(err)
        }
    },

    // deletePost: (req, res) => {
    //     Post.deleteOne( {_id: req.params.id} )
    //         .then(deleteConfirmation => {
    //             res.json(deleteConfirmation)
    //         })
    //         .catch(err => {
    //             res.json({message: 'Something went wrong: ', error: err})
    //         });
    // },

    //still needs work 
    deletePost: async (req,res) => {
        try{
        const getCreaterId = await Post.find({_id: req.params.id})
        const creatorId = getCreaterId[0].postedBy.toString()
        console.log(req.jwtpayload.id,creatorId)
        if (req.jwtpayload.id != creatorId ){
            console.log("You are not authorized to delete this post")
            return
        }
        else{
            console.log('inside the delete ')
            const postDelete = await Post.deleteOne({_id: req.params.id})
            console.log(postDelete)
            return res.json(postDelete)
        }
    }
    catch(err){
        console.log("something went wrong deleting your post")
        res.status(400).json(err)
    }
    },

addImage: async (req,res) => {
        try{
            let findImageArray = await Post.find({_id: req.params.id})

            const addPic = req.file.filename
            let ps = req.body
            //we need to handle what if there is no image added and the api fired , maybe handle on the fronend 
            if ( findImageArray[0].postPicture == undefined) {
                ps.postPicture = addPic
                console.log(ps,'this is to check the the data')
                
                const findPost = await Post.findOneAndUpdate(
                    {_id: req.params.id}, 
                    ps, 
                    {new:true,runValidators:true})
                    res.json(findPost)
                console.log(findPost)
    

            } else {
                console.log('printing images')
                ps.postPicture = addPic
                console.log(ps)

                const findPost = await Post.findOneAndUpdate(
                    {_id: req.params.id}, 
                    ps, 
                    {new:true,runValidators:true})
                    res.json(findPost)
                console.log(findPost)
        }

            // const profileImageToDB = {
            //     pictureFileName:req.file.filename,
            //     pictureByUser:req.jwtpayload.id,
            //     pictureOnPost:req.params.id
            // }
            // console.log(profileImageToDB ,' my pic object')
            // const pushToPicsDB = await Picture.create(profileImageToDB)
        }
        catch(err){
            console.log(err)
            console.log(err)
            res.status(400).json(err)
        }
    },

    deleteImage: async (req,res) => {
        try{
        const PostInfo = await Post.find({postPicture:req.params.id})
        console.log(PostInfo,'All info')
        console.log(PostInfo[0].postPicture.length,"Array")

        // if (PostInfo[0].postPicture.length < 2) {
        //     res.json("Sorry you can't delete the image add one to be able to delete")
        // }

        // else {
            fs.unlink(`./../client/public/images/${req.params.id}`, function(err) {
            if (err) throw err;
        
            console.log('file deleted');
        });

            Picture.deleteOne( {pictureFileName:req.params.id} )
            .then(deleteConfirmation => {
                res.json(deleteConfirmation)
            })
            .catch(err => {
                console.log(err)
                res.status(400).json(err)
            });

            // let imagesArray = PostInfo[0].postPicture
            // console.log(imagesArray,'imagesArray')
            // imagesArray = imagesArray.filter(function(item) {
            //     return item !== req.params.id
            // });
            // console.log(imagesArray)
            // PostInfo.postPicture = imagesArray
            const updateImageList = await Post.updateOne({postPicture:req.params.id},{ $pullAll: {postPicture: [req.params.id] }})
        // }
    }
    catch(err) {
        console.log(err)
        return res.status(400).json(err)
    }

}};
