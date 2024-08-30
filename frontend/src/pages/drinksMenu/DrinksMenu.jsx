import OtherProductsCard from "../../components/OtherProductsCard/OtherProductsCard";
import { drinksProducts } from "../../utils/products"
import { MenuContainer } from "../pizzaMenu/styledMenu";

export const DrinksMenu = () => {

    return (
        <MenuContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          role="menu"
        >
          {drinksProducts.map((product) => (
            <OtherProductsCard key={product.id} product={product} role="menuitem" />
          ))}
        </MenuContainer>
      );
    
}