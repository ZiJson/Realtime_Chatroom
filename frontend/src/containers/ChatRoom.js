import { useState, useEffect, useRef } from 'react'
import { Button, Input, Tag, message, Tabs } from 'antd'
import { useChat } from './hooks/useChat';
import Title from '../components/Title'
import styled from 'styled-components';
import Message from '../components/Message';
import ChatModal from '../components/ChatModal';

const ChatBoxesWrapper = styled(Tabs)`
width: 100%;
height: 300px;
background: #eeeeee52;
border-radius: 10px;
margin:  20px auto;
padding: 20px;
overflow: auto;
`
const FootRef = styled.div`
height: 10px;
`;



function ChatRoom() {
    const { status, messages, setMessages, sendMessage, clearMessages, displayStatus, me, sendChat, friend, setFriend, startChat, chatBoxes, setChatBoxes, data } = useChat()
    const [username, setUsername] = useState(me)
    const [body, setBody] = useState('')
    const bodyRef = useRef(null)
    const msgFooter = useRef(null)
    const [msgSent, setMsgSent] = useState(false); // { label, children, key }
    const [activeKey, setActiveKey] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    // const displayStatus = (s) => {
    //     if (s.msg) {
    //         const { type, msg } = s;
    //         const content = {
    //             content: msg, duration: 0.5
    //         }
    //         switch (type) {
    //             case 'success':
    //                 message.success(content)
    //                 break
    //             case 'error':
    //             default:
    //                 message.error(content)
    //                 break
    //         }
    //     }
    // // }
    // useEffect(() => {
    //     displayStatus(status)
    // }, [status]);
    useEffect(() => {
        console.log("華")
        scrollToBottom();
        setMsgSent(false);
    }, [msgSent]);
    useEffect(() => {
        setMsgSent(true);
        console.log("更新messages", messages)
        rerenderChatBox(activeKey)
    }, [messages]);
    const scrollToBottom = () => {
        msgFooter.current?.scrollIntoView
            ({ behavior: 'smooth', block: "start" });
    };
    const renderChat = (chat) => (
        chat.length === 0 ? (
            <>
                <p style={{ color: '#ccc' }}> No messages... </p>
                <FootRef id='foot' ref={msgFooter} />
            </>
        ) : (
            chat.map(({ sender: name, body }, i) => {
                return <Message isMe={name === me ? true : false} message={body}></Message>
            }
            )
        )); // 產生 chat 的 DOM nodes
    const extractChat = (friend) => {
        return renderChat
            (messages.filter
                (({ sender, body }) => ((sender === friend) || (sender === me))));

    };
    const rerenderChatBox = (activeKey) => {
        if (activeKey) {
            const index = chatBoxes.findIndex
                (({ key }) => key === activeKey);
            const newChatBoxes = chatBoxes;
            const chat = extractChat(friend);
            newChatBoxes[index].children = chat
            setChatBoxes(newChatBoxes)
        }
    }
    const removeChatBox =
        (targetKey, activeKey) => {
            const index = chatBoxes.findIndex
                (({ key }) => key === activeKey);
            const newChatBoxes = chatBoxes
                .filter(({ key }) =>
                    key !== targetKey);
            setChatBoxes(newChatBoxes);
            return activeKey ? activeKey === targetKey ? index === 0 ? '' : chatBoxes[index - 1].key : activeKey : '';
        };
    const createChatBox = (friend) => {
        if (chatBoxes.some
            (({ key }) => key === friend)) {
            throw new Error(friend +
                "'s chat box has already opened.");
        }
        const chat = extractChat(friend);
        console.log(chat)
        setChatBoxes([...chatBoxes,
        {
            label: friend, children: chat,
            key: friend
        }]);
        console.log("chatboxes", chatBoxes)
        setMsgSent(true);
        return friend;
    };
    const clean = () => {
        clearMessages({ name: username, to: activeKey })
    }
    return (
        <div >
            <Title name={me} ></Title>
            <ChatBoxesWrapper
                tabBarStyle={{ height: '36px' }}
                type='editable-card'
                activeKey={activeKey}
                items={chatBoxes}
                onChange={(key) => {
                    setActiveKey(key);
                    extractChat(key);
                    setFriend(key);
                }}
                onEdit={(targetKey, action) => {
                    if (action === 'add') setModalOpen(true);
                    else if (action === 'remove') {
                        setActiveKey(removeChatBox(targetKey, activeKey))
                    }
                }}

            >

                <FootRef id='foot' ref={msgFooter} />
            </ChatBoxesWrapper >

            <ChatModal
                open={modalOpen}
                onCreate={async ({ name }) => {
                    console.log("startChat")
                    setFriend(name)
                    setActiveKey(createChatBox(name));
                    try {
                        await startChat({
                            variables: {
                                name1: me,
                                name2: name
                            },
                        });
                    }
                    catch (e) {
                        console.log(e)
                    };

                    extractChat(name);
                    setModalOpen(false);

                }}
                onCancel={() => { setModalOpen(false) }}
            />
            <Input.Search
                ref={bodyRef}
                enterButton="Send"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type a message here..."
                onSearch={async (msg) => {
                    console.log(chatBoxes)
                    if (!msg || !username) {
                        displayStatus({
                            type: 'error',
                            msg: 'Please enter a username and a message body.'
                        })
                        return
                    }
                    try {
                        await sendMessage({
                            variables: {
                                sender: me,
                                to: friend,
                                body: msg
                            },
                        });
                    }
                    catch (e) {
                        console.log(e)
                    }
                    sendMessage({ name: username, to: friend, body: msg })
                    console.log(chatBoxes)
                    setBody('')
                }}
            ></Input.Search>
        </div >
    )
}

export default ChatRoom;

{/* <Input
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        bodyRef.current.focus()
                    }
                }}
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ marginBottom: 10 }}
            ></Input> */}