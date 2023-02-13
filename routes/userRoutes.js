const express = require("express")
const {
    createUser,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    followUser,
    getNearbyFriends,
    getFollowersList,
    getFollowingList
} = require("../controllers/userController")

const router = express.Router()


// get all users
router.get("/", getUsers);

// get a single user
router.get("/:id", getUser );

// add a new user
router.post("/", createUser);

// get friends nearby
router.post('/:id/nearby', getNearbyFriends)

// delete a user
router.delete('/:id', deleteUser)

// update user info
router.patch('/:id', updateUser)

// follow another user
router.post('/:id/follow', followUser)

// get my followers list
router.get('/:id/followers', getFollowersList)

// get my followering list
router.get('/:id/following', getFollowingList)

module.exports = router