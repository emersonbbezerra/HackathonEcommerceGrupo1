import styled from "styled-components";
import img from "../../assets/header-bg.png";

export const HeaderContainer = styled.header`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f97316;
    background-image: url(${img});
    background-repeat: no-repeat;
    background-position: center;
    padding: 1rem;

    h1{
        font-size: 15rem;
        font-family: "Nanum Pen Script", cursive;
    }

    @media(max-width: 1270px){
        h1{
            font-size: 10rem;
        }
    }

    @media(max-width: 870px){
        h1{
            font-size: 5rem;
        }
    }
`

export const Image = styled.img`
    width: 15vw;
`