import mongoose from 'mongoose';


const ChatBoxSchema = new mongoose.Schema({
    name: {
        type: String,
        required:
            [true, 'Name field is required.']
    },
    messages: [{
        sender: { type: String },
        body: { type: String },
    }],
});
const ChatBoxModel =
    mongoose.model('ChatBox',
        ChatBoxSchema)





// /******* Message Schema *******/
// const MessageSchema = new mongoose.Schema({
//     name: { type: String, required: [true, 'Sender field is required.'] },
//     body: { type: String, required: [true, 'Body field is required.'] },
// });
// const MessageModel = mongoose.model('Message', MessageSchema);
// /******* ChatBox Schema *******/
// const ChatBoxSchema = new mongoose.Schema({
//     name: { type: String, required: [true, 'Name field is required.'] },

//     messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
// });
// const ChatBoxModel = mongoose.model('ChatBox', ChatBoxSchema);

export default ChatBoxModel ;