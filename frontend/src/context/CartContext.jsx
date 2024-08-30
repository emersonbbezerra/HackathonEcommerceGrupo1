import React, { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity, size) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.id === product.id && item.size === size
    );

    if (existingItemIndex !== -1) {
      // Se o item já existe, atualiza a quantidade
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
    } else {
      // Se o item é novo, adiciona ao carrinho
      setCartItems([
        ...cartItems,
        {
          ...product,
          quantity,
          size,
          price: product.price[sizeIndex(size)],
        },
      ]);
    }
  };

  const removeFromCart = (itemId, size) => {
    setCartItems(
      cartItems.filter((item) => !(item.id === itemId && item.size === size))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const updateCartItemQuantity = (itemId, size, quantityChange) => {
    setCartItems((prevCartItems) =>
      prevCartItems.map((item) => {
        if (item.id === itemId && item.size === size) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity + quantityChange) // garante que a quantidade não seja menor que 1
          };
        }
        return item;
      })
    );
  };
  
  // Função auxiliar para obter o índice do preço pelo tamanho
  const sizeIndex = (size) => {
    switch (size) {
      case "broto":
        return 0;
      case "média":
        return 1;
      case "grande":
        return 2;
      case "gigante":
        return 3;
      case "família":
        return 4;
      case "super-família":
        return 5;
      default:
        return 0;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);