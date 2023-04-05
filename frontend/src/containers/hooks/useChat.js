import { useState, useEffect, useContext } from "react";
import { Button, Input, Tag, message } from 'antd'
import { createContext } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
    CHATBOX_QUERY, CREATE_CHATBOX_MUTATION,
    MESSAGE_SUBSCRIPTION, CREATE_MESSAGE_MUTATION
} from "../../graphql";


// var client = new WebSocket('ws://localhost:4000');

const ChatContext = createContext({
    status: {},
    me: "",
    signedIn: false,
    messages: [],
    sendMessage: () => { },
    clearMessages: () => { },
});

const ChatProvider = (props) => {
    const LOCALSTORAGE_KEY = "save-me";
    const savedMe = localStorage.getItem(LOCALSTORAGE_KEY)
    const [status, setStatus] = useState({});
    const [me, setMe] = useState(savedMe || "");
    const [friend, setFriend] = useState('')
    const [signedIn, setSignedIn] = useState(false);
    const [messages, setMessages] = useState([]);
    const [chatBoxes, setChatBoxes] = useState([]);
    const clearMessages = (payload) => {
        sendData(["clear", payload]);
    };

    const sendChat = (payload) => {
        sendData(["chat", payload]);
        // setMessages([...messages, payload]);
        console.log(payload);
    };
    const sendData = async (data) => {
        // await client.send(JSON.stringify(data));

    };
    const displayStatus = (s) => {
        if (s.msg) {
            const { type, msg } = s;
            const content = {
                content: msg, duration: 0.5
            }
            switch (type) {
                case 'success':
                    message.success(content)
                    break
                case 'error':
                default:
                    message.error(content)
                    break
            }
        }
    }
    // define states
    const { loading, error, data, subscribeToMore }
        = useQuery(CHATBOX_QUERY, {
            variables: {
                name1: me,
                name2: friend,
            },
        });
    const [startChat] = useMutation(CREATE_CHATBOX_MUTATION);
    const [sendMessage] = useMutation(CREATE_MESSAGE_MUTATION);

    useEffect(() => {
        try {
            console.log("收到publish:", me, friend)
            subscribeToMore({
                document: MESSAGE_SUBSCRIPTION,
                variables: { from: me, to: friend },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) {
                        console.log("沒收到東西")
                        return prev;
                    }
                    const newMessage = subscriptionData.data.message.body;
                    console.log("update:", newMessage)
                    console.log("pre:", prev)
                    let newData = {
                        ChatBox: {
                            messages: [...prev.ChatBox.messages, newMessage],
                        }
                    }
                    console.log("Data:", newData)
                    return {
                        ChatBox: {
                            messages: [...prev.ChatBox.messages, newMessage],
                        },
                    };
                },
            });

        } catch (e) {
            console.log(e);
        }
        if (error) { console.log("error:", error) }
    }, [subscribeToMore, friend]);
    useEffect(()=>{
        if(data){
            console.log("data:",data)
            setMessages(data.ChatBox.messages)
        }
    },[data])
    // useEffect(() => {
    //     if (signedIn) {
    //         localStorage.setItem(LOCALSTORAGE_KEY, me);
    //     }
    // }, [me, signedIn]);
    // client.onmessage = (byteString) => {
    //     const { data } = byteString;

    //     const [task, payload] = JSON.parse(data);
    //     console.log("receive:[", task, ',', payload, ']')
    //     switch (task) {
    //         case "output": {
    //             setMessages(() =>
    //                 [...messages, payload]); break;
    //         }
    //         case "status": {
    //             setStatus(payload); break;
    //         }
    //         case "init": {
    //             setMessages(payload);
    //             console.log("收到init:", payload)
    //             break;
    //         }
    //         case "cleared": {
    //             setMessages([]);
    //             break;
    //         }
    //         default: break;
    //     }
    // }
    return (
        <ChatContext.Provider
            value={{
                status, me, friend, setFriend, signedIn, messages, setStatus, setMe, setSignedIn, setMessages,
                sendMessage, clearMessages, displayStatus, sendChat, startChat, chatBoxes, setChatBoxes, data
            }}
            {...props}
        />
    );
};
const useChat = () => useContext(ChatContext);
export { ChatProvider, useChat };

