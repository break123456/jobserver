const { default: mongoose } = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true, 
        unique: true 
    },
    slug: {
        type: String,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    address: [{
        type: String,
        trim: true
    }],
    industry: [{
        type: String,
        trim: true
    }],
    logo : {
        type: String,
        trim: true
    },
    numEmployee: {
        type: String,
        enum :["0-50", "51-100", "101-500", "501-1000", "1000+"],
        default: "0-50"
    },
    domain : {
        url: {
            type: String,
            lowercase: true,
            trim: true
        },
        verified: {
            type: Boolean,
            default: false
        }
    }
},
{
    timestamps: true
});

module.exports = companySchema;