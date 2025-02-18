const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");

const chatCtrl = {
  findChat: async (req, res) => {
    try {
      const { firstId, secondId } = req.params;
      const chat = await Chat.findOne({
        members: { $all: [firstId, secondId] },
      });
      if (chat) {
        return res.status(200).send({ message: "found chat!", chat });
      }
      const newChat = await Chat({ members: [firstId, secondId] });
      await newChat.save();
      res.status(201).send({ message: "found Chat", chat: newChat });
    } catch (error) {
      res.status(502).send({ message: error.message });
    }
  },
  userChat: async (req, res) => {
    try {
      const userId = req.user._id;
      const chats = await Chat.find({ members: { $in: [userId] } });
      res.status(200).send({ message: "user's chats!", chats });
    } catch (error) {
      res.status(502).send({ message: error.message });
    }
  },
  deleteChat: async (req, res) => {
    try {
      const {chatId} = req.params;
      const chat = await Chat.findByIdAndDelete(chatId);
      if (chat) {
        await Message.deleteMany({chatId})
        return res.status(200).send({ message: "chat deleted!", chat });
      }
      res.status(404).send({ message: "chat nod found" });
    } catch (error) {
      res.status(502).send({ message: error.message });
    }
  },
};

module.exports = chatCtrl;
