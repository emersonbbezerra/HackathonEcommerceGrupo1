import styled from "styled-components";

export const ButtonStyled = styled.button`
    text-align: center;
    width: 20vw;
    height: 7vh;
    background-color: darkorange;
    color: whitesmoke;
    font-size: 1.5rem;
    font-weight: 700;
    border-radius: 20px;
    transition: transform 0.5s ease;
    box-shadow: 8px 8px 8px rgba(0, 255, 0, 0.5);

    &:hover {
        background-color: orange;
        transform: scale(1.1);
        box-shadow: 10 10px 10px rgba(0, 255, 0, 0.2);
    }
`