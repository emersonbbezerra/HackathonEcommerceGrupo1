import OtherProductsCard from "../../components/OtherProductsCard/OtherProductsCard";
import { dessertProducts } from "../../utils/products"
import { MenuContainer } from "../pizzaMenu/styledMenu";

export const DessertsMenu = () => {

    return (
        <MenuContainer
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          role="menu"
        >
          {dessertProducts.map((product) => (
            <OtherProductsCard key={product.id} product={product} role="menuitem" />
          ))}
        </MenuContainer>
      );
    
}