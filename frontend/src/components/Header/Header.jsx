import { HeaderContainer, Image } from "./styledHeader";
import logo from "../../assets/logo.png";

export const Header = () => {
  return (
    <HeaderContainer role="banner">
      <h1 className="text-8xl font-bold" aria-label="Letra P">P</h1>
      <Image src={logo} alt="Logo da PizzaPalooza" />
      <h1 className="text-8xl font-bold" aria-label="PizzaPalooza">zzaPalooza</h1>
    </HeaderContainer>
  );
};
