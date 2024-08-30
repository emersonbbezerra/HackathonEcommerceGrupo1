import { FooterContainer, Image } from "./styledFooter"
import logo from "../../assets/logo.png"

export const Footer = () => {
    return (
        <FooterContainer>
            <Image src={logo} />
            &copy; 2024 PizzaPalooza
        </FooterContainer>
    )
}