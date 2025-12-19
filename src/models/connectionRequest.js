const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const {Schema}= mongoose

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: ObjectId,
        required: true,
        ref: "User"
    },
    toUserId: {
        type: ObjectId,
        required: true,
        ref:"User"
    },
    status :{
        type:String,
        enum:{
            values:["ignored","interested", "accepted", "rejected"],
            message: `{VALUE} Is Incorrect Status Type `
        }
    }

},
{
    timestamps:true
}
)


//creating index
/*
createIndex() should be used on a Mongoose model or the underlying MongoDB collection,
 not on the schema. In most applications, indexes should be defined using schema.index() 
 because it’s safer and managed automatically by Mongoose.
*/
connectionRequestSchema.index({fromUserId:1,toUserId:1},{ unique: true });


/*
schema.pre is Mongoose middleware that runs before a database operation.
 It allows validation, transformation, or blocking logic before data is saved.
*/
connectionRequestSchema.pre("save", function(next){
    const connectionRequest = this;
    //check if the fromUserid and toUserId are same

    /*connectionRequest.fromUserId === connectionRequest.toUserId 
     this doesnot work because In JavaScript, objects are compared by reference, not by value. 
     MongoDB ObjectIds are objects, so they must be compared using .equals().
    */
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You can't send connction request to yourself!");
        
    }
    next();
})

module.exports.ConnectionRequest = new mongoose.model('ConnectionRequest',connectionRequestSchema);