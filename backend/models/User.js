import mongoose from "mongoose";


import bcrypt from "bcryptjs"

const UserSchema = new mongoose.Schema(
    {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    role: {

        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    watchList: {
        type: [String],
        default: []
    }
}, 
{timestamps: true
    
})


UserSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return;
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    
})


const User = mongoose.model("User", UserSchema, "User_Collection")

export default User