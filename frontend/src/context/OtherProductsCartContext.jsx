import React, { createContext, useState, useContext, useEffect } from "react";

const OtherProductsCartContext = createContext();

export const OtherProductsCartProvider = ({ children }) => {
  const [otherProductsCartItems, setOtherProductsCartItems] = useState(() => {
    const otherProductsStoredCart = localStorage.getItem("otherProductsCartItems");
    return otherProductsStoredCart ? JSON.parse(otherProductsStoredCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("otherProductsCartItems", JSON.stringify(otherProductsCartItems));
  }, [otherProductsCartItems]);

  const addOtherProductsToCart = (product, quantity) => {
    const existingItemIndex = otherProductsCartItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingItemIndex !== -1) {
      // Se o item já existe, atualiza a quantidade
      const updatedCartItems = [...otherProductsCartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setOtherProductsCartItems(updatedCartItems);
    } else {
      // Se o item é novo, adiciona ao carrinho
      setOtherProductsCartItems([
        ...otherProductsCartItems,
        {
          ...product,
          quantity,
          price: product.price,
        },
      ]);
    }
  };

  const removeOtherProductsFromCart = (itemId) => {
    setOtherProductsCartItems(
        otherProductsCartItems.filter((item) => !(item.id === itemId))
    );
  };

  const clearCartOtherProducts = () => {
    setOtherProductsCartItems([]);
  };
  
  const updateCartItemQuantityOtherProducts = (itemId, quantityChange) => {
    setOtherProductsCartItems((prevCartItems) =>
      prevCartItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity + quantityChange) // garante que a quantidade não seja menor que 1
          };
        }
        return item;
      })
    );
  };

  return (
    <OtherProductsCartContext.Provider
      value={{
        otherProductsCartItems,
        addOtherProductsToCart,
        removeOtherProductsFromCart,
        clearCartOtherProducts,
        updateCartItemQuantityOtherProducts,
      }}
    >
      {children}
    </OtherProductsCartContext.Provider>
  );
};

export const useOtherProductsCart = () => useContext(OtherProductsCartContext);