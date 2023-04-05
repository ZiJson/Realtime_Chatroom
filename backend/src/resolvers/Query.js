
const makeName =
(name, to) => { return [name, to].sort().join('_'); };
const Query = {
  ChatBox: async (parent, { name1, name2 }, { ChatBoxModel }) => {
    const chatBoxName = makeName(name1, name2);
    let box = await ChatBoxModel.findOne({name:chatBoxName});
    if (!box)
      box = await new ChatBoxModel({chatBoxName }).save();
    return box;
  },
};
export default Query;