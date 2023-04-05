import LogIn from "../components/Login";
import {useChat} from "./hooks/useChat";
import Title from "../components/Title";

const SignIn = () => {
    const {displayStatus,setSignedIn, me, setMe } = useChat();
    const handleLogin = (name) => {
        if (!name)
            displayStatus({
                type: "error",
                msg: "Missing user name",
            });
        else setSignedIn(true);
    }
    console.log("from sign me:", me)
    return (
        <>
            <Title />
            <LogIn me={me} setName={setMe} onLogin={handleLogin} />
        </>
    );
}
export default SignIn;