/*Dependencies*/
const mongoose = require('mongoose');

/*schema constructor*/
const { Schema } = mongoose;

/*schema*/
const userSchema = new Schema({
    name: { type: String },
    email: { type: String },
    mobile: { type: Number },
    image_url: { type: String },
 }, { timestamps: true });

/*model*/
const UserInfo = mongoose.model(
    'users',
    userSchema
);

/*export*/
module.exports = UserInfo;