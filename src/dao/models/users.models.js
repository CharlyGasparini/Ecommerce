import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    age: {
        type: Number,
        default: 18
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        required: true
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "premium"]
    },
    lastActivity: {
        type: Number,
        default: new Date().getTime(),
        required: true    }
});

userSchema.pre("find", function(){
    this.populate("cart");
})

const userModel = mongoose.model(usersCollection, userSchema);

export default userModel;