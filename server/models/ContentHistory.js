const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const historySchema = new Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content:{
        type: String,
        required: true
    },
    
},{
    timestamps: true
});

const ContentHistory = mongoose.model('ContentHistory', historySchema);
module.exports = ContentHistory;