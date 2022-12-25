import { gql } from '@apollo/client';
export const CHATBOX_QUERY = gql`
query ChatBox($name1: String!, $name2: String!){
ChatBox(name1:$name1, name2:$name2) {
name
messages {
sender
body
}
}
}
`;