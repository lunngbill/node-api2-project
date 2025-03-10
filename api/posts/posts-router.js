// implement your posts router here


const express = require("express")
const posts = require("./posts-model")

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const allPosts = await posts.find()
        res.json(allPosts)
    } catch (err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const postId = await posts.findById(req.params.id)
        if (postId) {
            res.json(postId)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch (err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

router.post("/", async (req, res) => {
    const { title, contents } = req.body;
    if(!title || !contents) {
        return res.status(400).json({ message: "Please provide title and contens for the post"})
    }
    try {
        const newPostId = await posts.insert({ title, contents })
        const newPost = await posts.findById(newPostId.id)
        res.status(201).json(newPost)
    } catch (err) {
        res.status(500).json({ message: "There was an error while saving the post to the database" })
    }
})

router.put("/:id", async (req, res) => {
    const { title, contents } = req.body;
    if(!title || !contents) {
        return res.status(400).json({ message: "Please provide title and contents for the post"})
    }
    try {
        const updatePost = await posts.update(req.params.id, { title, contents })
        if (updatePost) {
            const updatePostId = await posts.findById(req.params.id)
            res.json(updatePostId)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch (err) {
        res.status(500).json({ message: "The posts information could not be modified" })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const postId = await posts.findById(req.params.id)
        if (postId) {
            await posts.remove(req.params.id)
            res.json(postId)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch (err) {
        res.status(500).json({ message: "The posts could not be removed" })
    }
})

router.get("/:id/comments", async (req, res) => {
    try {
        const postId = await posts.findById(req.params.id)
        if (postId) {
            const comments = await posts.findPostComments(req.params.id)
            res.json(comments)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }
    } catch (err) {
        res.status(500).json({ message: "The posts information could not be retrieved" })
    }
})

module.exports = router