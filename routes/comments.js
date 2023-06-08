const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

router.route('/')
    .post( async(req,res,next)=>{
        try {
            const comments = await Comment.create({
                commenter:req.body.id,
                comment:req.body.comment,
            });
            console.log("comments",comments);
            res.json(comments);
        } catch(err){
            console.error(err);
            next(err);
        }
    });

router.route('/:id')
    .patch(async (req,res,next)=>{
        try {
            const comment = await Comment.update({
                comment: req.body.comment
            },{
                where : {id:req.params.id}
            });
            console.log(comment);
            res.json(comment);
        } catch (err) {
            console.error(err);
            next(err);
        }
    })
    .delete(async (req,res,next)=>{
        try {
            const remove = await Comment.destroy({
                where: {id:req.params.id}
            })
            console.log("remove",remove);
            res.json(remove);
        } catch(err){
            console.error(err);
            next(err);
        }
    });

module.exports = router;