const User = require('../models/User')
const mongoose = require("mongoose")

// get all workouts
const getUsers = async (req,res) => {
    const users = await User.find()
    res.status(200).json(users);
}

// get a single User
const getUser = async (req,res) => {
    const {id} = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "no such user"});
    }

    const user = await User.findById(id)

    if (!user) {
        return res.status(400).json({error: "no such user"});
    }

    res.status(200).json(user)

}

// create a new workout
const createUser = async (req,res) => {
    const {name, dob, address, description, location} = req.body;

    let emptyFields = []

  if (!name) {
    emptyFields.push('name')
  }
  if (!dob) {
    emptyFields.push('dob')
  }
  if (!address) {
    emptyFields.push('address')
  }
  if (!description) {
      emptyFields.push('description')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in all fields', emptyFields })
  }

    try {
        const user = await User.create({name, dob, address, description, location});
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
};

// delete a workout
const deleteUser = async (req,res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "no such user"});
    }

    const user = await User.findByIdAndDelete(id)

    if (!user) {
        return res.status(400).json({error: "no such user"});
    }

    res.status(200).json(user)    
}

// update a workout
const updateUser = async (req,res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "no such user"});
    }

    const user = await User.findOneAndUpdate({_id:id}, {
        ...req.body
    })

    if (!user) {
        return res.status(400).json({error: "no such user"});
    }

    res.status(200).json(user)  
}

const followUser = async (req, res) => {
    const selfID = req.params.id;

    const friendID = req.body.id;

    if (!mongoose.Types.ObjectId.isValid(selfID)) {
        return res.status(404).json({error: "no such self user"});
    }
    if (!mongoose.Types.ObjectId.isValid(friendID)) {
        return res.status(404).json({error: "no such friend user"});
    }

    try{
        const selfUser = await User.findOneAndUpdate({_id:selfID}, {
            $push: {
                followingUserID: friendID
            }
        }) 
        const friendUser = await User.findOneAndUpdate({_id:friendID}, {
            $push: {
                followersUserID: selfID
            }
        })

        res.status(200).json(selfUser)
    } 
    catch (error)  {
        res.status(400).json({error: error.message})
    }
}

const getNearbyFriends = async (req,res) => {
    const { id } = req.params


    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "no such user"});
    }

    const {maxDistance} = req.body;

    const user = await User.findById(id)
    
    if (!user) {
        return res.status(400).json({error: "no such user"});
    }

    console.log(user.location)

    const nearbyFriends = await User.find({
        location:{
            $near:{
                $geometry: user.location,
                $maxDistance: maxDistance
            }
        }
    })

    // const nearbyFriends = await User.aggregate([
    //     {
    //         "$geoNear": {
    //             "near": user.location,
    //             distanceField: "distance",
    //             "spherical": true,
    //             "maxDistance": 10000
    //         }
    //     }
    // ])


    if(!nearbyFriends) {
        return res.status(400).json({error: "no friends"})
    }

    
    res.status(200).json(nearbyFriends)  
}

const getFollowersList = async (req,res) => {
    const {id} = req.params;
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "no such user"});
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({error: "no such user"});
    }

    const followersList = await User.find({
        _id: {
            $in: user.followersUserID
        }
    })

    return res.status(200).json(followersList)
}

const getFollowingList = async (req,res) => {
    const {id} = req.params;
 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "no such user"});
    }

    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({error: "no such user"});
    }

    const followingList = await User.find({
        _id: {
            $in: user.followingUserID
        }
    })

    return res.status(200).json(followingList)
}

module.exports = {
    createUser,
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    followUser,
    getNearbyFriends,
    getFollowersList,
    getFollowingList
}