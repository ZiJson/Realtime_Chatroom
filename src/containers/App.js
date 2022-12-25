import styled from 'styled-components';
import {useChat} from "./hooks/useChat";
import { useEffect } from 'react';
import ChatRoom from './ChatRoom';
import SignIn from './SignIn';

const Wrapper = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
height: 100vh;
width: 500px;
margin: auto;
`;


const App = () => {
    const { status, signedIn, displayStatus, setSignedIn, me, setMe } = useChat()
    useEffect(() => {
        displayStatus(status)
    }, [status, displayStatus])
    return (
        <Wrapper> {signedIn ? <ChatRoom /> : <SignIn />} </Wrapper>
    )
}

export default App;