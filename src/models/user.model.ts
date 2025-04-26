import mongoose ,{ model,Schema} from "mongoose";

const userSchema = new Schema({
    name:{ type: String, required: true },
    email:{ type: String, required: true, unique: true },
    password:{ type: String },
    image:{ type: String },
    googleId:{ type: String },
});

export default model("User", userSchema);