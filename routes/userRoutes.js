const express = require("express")
const {
    createUser,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    followUser
} = require("../controllers/userController")

const router = express.Router()


// get all users
router.get("/", getUsers);

// get a single workout
router.get("/:id", getUser );

// post a new workout
router.post("/", createUser);

// delete a workout
router.delete('/:id', deleteUser)

// update a workout
router.patch('/:id', updateUser)

router.post('/follow/:id', followUser)

module.exports = router