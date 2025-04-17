const mongoose = require("mongoose");

const userSchema = new mongoose.Schema ({
    username:{
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    roles:[{type:mongoose.Schema.Types.ObjectId, ref: "Role"}]
});

module.exports= mongoose.model("User", userSchema);