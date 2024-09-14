const socketIo = require('socket.io');
const Chatroom = require('./models/chatroom');
const ChatMsg = require('./models/chatmsg');

// Function to initialize Socket.IO
const initSocket = (server) => {
    const io = socketIo(server, {
        cors: {
            origin: "*", // This allows all origins, or you can specify the exact domain, e.g. "http://localhost:3000"
            methods: ["GET", "POST"], // Specify the HTTP methods that are allowed
        }
    });
    console.log("initsocker");

    // Handle Socket.IO connections for one-on-one chat
    io.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        // Join a unique one-on-one chat room (only admin can create room)
        socket.on('CREATE_ROOM', async ({ postId, empId, studentId }) => {
            try {
                // Ensure the chatroom exists and is valid
                const chatroom = await Chatroom.findOne({ postId, empId, studentId });
                if(!chatroom) {
                    //create room
                    const newChatroom = new Chatroom({
                        postId,
                        empId,
                        studentId,
                        status: 'active',
                      });
                  
                      const savedChatroom = await newChatroom.save();
                      if(savedChatroom) {
                        socket.emit('ROOM_CREATED', { type: "SUCECSS", roomId: newChatroom._id});
                      } else {
                        socket.emit('ERR_MSG', { type: "CREATE_ROOM", error: 'Room creation failed' });
                      }
                      return;
                } else {
                    socket.emit('ERR_MSG', { type: "ROOM_EXIST", roomId: chatroom._id, error: 'Room already exist' });
                    console.log(`User ${socket.id} create room: ${chatroom._id} failed`);
                    return;
                } 
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('ERR_MSG', { error: 'Could not create room.' });
            }
        });
        socket.on('LEAVE_ROOM', async ({chatroomId}) => {
            try {
                if(chatroomId)
                    socket.leave(chatroomId);
            } catch (error) {
                console.error('Error leaving  room:', error);
                socket.emit('ERR_MSG', { type: 'LEAVE_ROOM', error: 'Could not leave room.' });
            }
        });
        // Join a unique one-on-one chat room (room is based on chatroomId)
        socket.on('JOIN_ROOM', async ({chatroomId}) => {
            try {
                console.log("JOIN_ROOM request rece:" + chatroomId);
                // Ensure the chatroom exists and is valid
                const chatroom = await Chatroom.findById(chatroomId);
                if (chatroom) {
                    //doesn't allow chat if room is disabled
                    if (chatroom.status === "disabled") {
                        socket.emit('ERR_MSG', { type: "ROOM_DISABLED", error: 'Room is disabled, no further chat allowed' });
                        return;
                    }
                    socket.join(chatroomId);
                } else {
                    socket.emit('ERR_MSG', { type: "ROOM_INVALID", error: 'Invalid chatroom or access denied.' });
                }
            } catch (error) {
                console.error('Error joining room:', error);
                socket.emit('ERR_MSG', { error: 'Could not join room.' });
            }
        });

        // Listen for chat messages from employer or student
        socket.on('SEND_MSG', async ({ messageId, chatroomId, sender, content, type }) => {
            console.log("SEND_MSG", messageId, chatroomId, sender, content, type);

            try {
                // Ensure the message is tied to a valid chatroom
                const chatroom = await Chatroom.findById(chatroomId);
                if (!chatroom || (chatroom.status !== "active")) {
                    socket.emit('ERR_MSG', { error: 'Invalid chatroom.' });
                    return;
                }

                // Save the message to the database
                const chatMessage = new ChatMsg({
                    messageId,
                    chatroomId,
                    sender,
                    content,
                    type
                });
                await chatMessage.save();

                // Emit the message to both employer and student in this one-on-one chatroom
                socket.to(chatroomId).emit('RECE_MSG', {
                    sender,
                    content,
                    type
                });
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('ERR_MSG', { error: 'Failed to send message.' });
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log('Client disconnected', socket.id);
        });
    });

    return io;
};

module.exports = initSocket;
