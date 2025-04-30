import { Schema, model } from 'mongoose'


const TagSchema = new Schema({
    title: { type: String, required: true, unique: true }
}, { timestamps: true })


const Tag = model("Tag", TagSchema)
export default Tag;