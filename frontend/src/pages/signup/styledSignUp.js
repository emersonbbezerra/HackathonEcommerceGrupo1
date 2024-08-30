import styled from "styled-components";
import img from "../../assets/slice-of-pizza.png"

export const LoginPageContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: black;
    min-height: 100vh;
    padding: 1rem;
    background-image: url(${img});
    background-repeat: no-repeat;
    background-position: center;
    
`

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2vh;
    background-color: black;
    padding: 3rem;
    height: 80vh;
    width: 30vw;
    border: 5px solid green;
    border-radius: 20px;

    div{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1vw;
    }

    .message {
        font-size: 1.5rem;
    }

    p {
        color: white;
        font-size: 3rem;
    }

    input {
        height: 7vh;
        width: 23vw;
        padding: 1rem;
        border-radius: 40px;
        font-size: 1.5rem;
    }

    span {
        color: white;
    }

    img {
        width: 3vw;
    }

    @media(max-width: 1270px){  
        width: 50vw;

        input{
            width: 40vw;
        }

    }

    @media(max-width: 870px){
        width: 80%;

        input{
            width: 60vw;
        }
    }
`