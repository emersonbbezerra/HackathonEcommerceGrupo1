import { ButtonStyled } from "./styledButton"

export const Button = (props) => {
    const {name} = props
    return (
        <ButtonStyled>{name}</ButtonStyled>
    )
}