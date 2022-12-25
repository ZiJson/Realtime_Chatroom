
const makeName =
(name, to) => { return [name, to].sort().join('_'); };
const Query = {
  ChatBox: async (parent, { name1, name2 }, { ChatBoxModel }) => {
    console.log("receice Query:",makeName(name1, name2) )
    const chatBoxName = makeName(name1, name2);
    let box = await ChatBoxModel.findOne({name:chatBoxName});
    if (!box)
      box = await new ChatBoxModel({name:chatBoxName }).save();
    console.log("box:",box)
    return box;
  },
};
export default Query;