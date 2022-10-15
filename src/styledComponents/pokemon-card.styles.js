import styled from 'styled-components';
import Paper from "@mui/material/Paper";

export default styled(Paper)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 0;
    margin: 2rem;
    min-width: 150px;
    height: 200px;
    text-align: center;
    box-shadow: 0 5px 25px 1px rgb(0 0 0 / 50%); 
    transition: all 0.2s ease-in-out;
    border-radius: 10px;

    &:hover{
        transform: scale(1.1);
        border: 1px solid yellow;
    }

    .poke-id{
        padding: 7px;
        font-weight: 600;
        font-size: 20px;
        font-family: 'Teko', sans-serif;
        //border: 1px solid #9c27b0;
        border-radius: 10px;
    }

    .more-info-container{
        margin-top: 10px;
        cursor: pointer;
    }

    .more-info{
        padding: 2px 13px;
        border: 2px solid black;
        border-radius: 16px;
        font-weight: 600;
        margin: 5px;
    }
`;
