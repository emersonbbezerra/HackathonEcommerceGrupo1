import React from "react";
import { useCart } from "../../context/CartContext";
import { useOtherProductsCart } from "../../context/OtherProductsCartContext";
import img from "../../assets/chef-2.png";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    updateCartItemQuantity,
  } = useCart();

  const {
    otherProductsCartItems,
    removeOtherProductsFromCart,
    clearCartOtherProducts,
    updateCartItemQuantityOtherProducts,
  } = useOtherProductsCart();

  const navigate = useNavigate();

  const combinedCartItems = [...cartItems, ...otherProductsCartItems];

  const totalPrice = combinedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleIncrement = (itemId, itemSize) => {
    if (cartItems.some(item => item.id === itemId && item.size === itemSize)) {
      updateCartItemQuantity(itemId, itemSize, 1);
    } else {
      updateCartItemQuantityOtherProducts(itemId, 1);
    }
  };

  const handleDecrement = (itemId, itemSize) => {
    if (cartItems.some(item => item.id === itemId && item.size === itemSize)) {
      updateCartItemQuantity(itemId, itemSize, -1);
    } else {
      updateCartItemQuantityOtherProducts(itemId, -1);
    }
  };

  const handleFinishOrder = () => {
    navigate("/checkout");
    clearCart();
    clearCartOtherProducts();
  };

  return (
    <div className="bg-black w-full h-full flex">
      <div className="bg-black text-white container p-10 min-h-[37vh]">
        <h1 className="text-xl font-bold mb-4">Seu Carrinho</h1>
        {combinedCartItems.length === 0 ? (
          <p>Seu carrinho está vazio.</p>
        ) : (
          <div>
            <ul role="list">
              {combinedCartItems.map((item) => (
                <li
                  key={`${item.id}-${item.size}`}
                  className="flex justify-between items-center py-2 border-b"
                  role="listitem"
                >
                  <div>
                    <span className="font-bold">{item.name}</span> -{" "}
                    {item.size ? `${item.size} - ` : ""} 
                    <button
                      onClick={() => handleDecrement(item.id, item.size)}
                      className="px-2 py-1 text-xs bg-orange-700 text-white rounded-md"
                      disabled={item.quantity <= 1}
                      aria-label="Decrementar quantidade do item"
                    >
                      -
                    </button>
                    <span className="text-xl m-2">{item.quantity}x</span>
                    <button
                      onClick={() => handleIncrement(item.id, item.size)}
                      className="ml-2 px-2 py-1 text-xs bg-blue-700 text-white rounded-md"
                      aria-label="Incrementar quantidade do item"
                    >
                      +
                    </button>
                  </div>
                  <div>
                    R${(item.price * item.quantity).toFixed(2)}
                    <button
                      onClick={() => {
                        if (cartItems.some(cartItem => cartItem.id === item.id && cartItem.size === item.size)) {
                          removeFromCart(item.id, item.size);
                        }

                        if (otherProductsCartItems.some(cartItem => cartItem.id === item.id)) {
                          removeOtherProductsFromCart(item.id)
                        }
                      }}
                      className="ml-2 px-2 py-1 text-xs text-white bg-red-500 rounded-md"
                      aria-label="Remover item do carrinho"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between items-center">
              <span className="font-bold">Total:</span>
              <span className="text-xl">R${totalPrice.toFixed(2)}</span>
            </div>
            <button
              onClick={() => {
                clearCart();
                clearCartOtherProducts();
              }}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
              aria-label="Limpar carrinho"
            >
              Limpar Carrinho
            </button>
            <button
              onClick={handleFinishOrder}
              className="mt-4 ml-2 px-4 py-2 bg-green-700 text-white rounded-md"
              aria-label="Finalizar pedido"
            >
              Finalizar pedido
            </button>
          </div>
        )}
      </div>
      <div className="bg-black hidden md:block">
        <img className="h-full bg-black" src={img} alt="Cliente com uma pizza" />
      </div>
    </div>
  );
};

export default Cart;

