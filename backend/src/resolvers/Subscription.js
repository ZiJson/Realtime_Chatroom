
const makeName =
(name, to) => { return [name, to].sort().join('_'); };

const Subscription = {
  message: {
  subscribe: (parent, { from, to }, { pubsub }) => {
  const chatBoxName = makeName(from, to);
  console.log("收到sub to :",chatBoxName)
  return pubsub.subscribe(`chatBox ${chatBoxName}`);
  },
  },
  };

export { Subscription as default };
