import React from 'react';
import PizzaCard from '../../components/PizzaCard/PizzaCard';
import { products } from '../../utils/products';
import { MenuContainer } from './styledMenu';
import { useNavigate } from 'react-router-dom';
import { useProtectedPage } from '../../hooks/useProtectedPages';

export const PizzaMenu = () => {
  const navigate = useNavigate();

  useProtectedPage(navigate);

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


