import styled from "styled-components"

export const TypingResults = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 padding-top: 20px;
 
 ul {
    list-style: none;
    padding: 0;

    li {
        font-size: 20px;
    }

    li:first-child {
        font-size: 40px
    }
 }
`

export default TypingResults
