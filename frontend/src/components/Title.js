import styled from 'styled-components';
import { Button, Input, Tag, message, Tabs } from 'antd'
const Wrapper = styled.div`
min-width: 400px;
display: flex;
align-items: center;
justify-content: center;
h1 {
margin: 0;
margin-right: 20px;
font-size: 3em;
}`;
const Title = ({name, clean}) => (
<Wrapper><h1>{name? `${name}'s `: "My "}
Chat Room</h1>
{clean?<Button type="primary" danger onClick={clean} >
                Clear
            </Button>:''}</Wrapper>
);

export default Title;