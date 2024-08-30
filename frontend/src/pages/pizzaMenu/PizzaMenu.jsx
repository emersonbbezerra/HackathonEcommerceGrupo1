import React from 'react';
import PizzaCard from '../../components/PizzaCard/PizzaCard';
import { products } from '../../utils/products';
import { MenuContainer } from './styledMenu';

export const PizzaMenu = () => {
 
  return (
    <MenuContainer
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      role="menu"
    >
      {products.map((product) => (
        <PizzaCard key={product.id} product={product} role="menuitem" />
      ))}
    </MenuContainer>
  );
};


