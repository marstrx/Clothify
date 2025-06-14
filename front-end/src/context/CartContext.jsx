import React, { createContext, useState, useContext, useMemo } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('fix your code ');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const { id, selectedSize } = product;

    const existingItem = cart.find(
      (item) => item.id === id && item.selectedSize === selectedSize
    );

    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === id && item.selectedSize === selectedSize
          ? { ...item, quantity: item.quantity + product.quantity }
          : item
      ));
    } else {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (itemKey) => {
    setCart(prevCart => prevCart.filter(item => 
      `${item.id}${item.selectedSize ? `-${item.selectedSize}` : ''}` !== itemKey
    ));
  };

  const updateQuantity = (itemId, newQuantity, selectedSize) => {
    if (newQuantity < 1) return;
    
    setCart(prevCart => 
      prevCart.map(item => {
        const itemKey = `${item.id}${item.selectedSize ? `-${item.selectedSize}` : ''}`;
        const updateKey = `${itemId}${selectedSize ? `-${selectedSize}` : ''}`;
        
        if (itemKey === updateKey) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};
