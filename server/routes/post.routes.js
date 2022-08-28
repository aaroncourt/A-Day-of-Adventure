const postController = require('../controllers/post.controller');
const upload = require('../config/multer.config')
const { authenticate } = require('../config/jwt.config');

module.exports = (app) => {
    app.get('/api/posts/all',authenticate,  postController.getAllPosts);
    app.get('/api/posts/all/:id',authenticate,  postController.getAllPostsByUserId);
    app.post('/api/posts/new',authenticate, upload.single('postPicture'), postController.createPost);
    app.get('/api/posts/:id',authenticate,  postController.getOnePost);
    app.put('/api/posts/:id/edit',authenticate, postController.updatePost);
    app.delete('/api/posts/:id',authenticate,  postController.deletePost);
    app.put('/api/post/addimage/:id',authenticate, upload.single('postPicture'), postController.addImage);
    app.delete('/api/post/deleteimage/:id',authenticate, postController.deleteImage);
};
