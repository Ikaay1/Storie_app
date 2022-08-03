import React, {createContext, useContext, useState, useEffect} from 'react';
import {toast} from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;

    useEffect(() => {
        if (
            JSON.parse(localStorage.getItem('cart'))?.length &&
            JSON.parse(localStorage.getItem('cart'))?.length >= 1
        ) {
            setCartItems(JSON.parse(localStorage.getItem('cart')));
        }
        if (JSON.parse(localStorage.getItem('quantities'))) {
            setTotalQuantities(JSON.parse(localStorage.getItem('quantities')));
        }
        if (JSON.parse(localStorage.getItem('price'))) {
            setTotalPrice(JSON.parse(localStorage.getItem('price')));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        localStorage.setItem('price', JSON.stringify(totalPrice));
        localStorage.setItem('quantities', JSON.stringify(totalQuantities));
    }, [cartItems, totalPrice, totalQuantities]);

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(
            (item) => item._id === product._id,
        );

        setTotalPrice(
            (prevTotalPrice) => prevTotalPrice + product.price * quantity,
        );
        setTotalQuantities(
            (prevTotalQuantities) => prevTotalQuantities + quantity,
        );

        if (checkProductInCart) {
            setCartItems((prevCartItems) =>
                prevCartItems.map((item) =>
                    item._id === checkProductInCart._id
                        ? {
                              ...checkProductInCart,
                              quantity: checkProductInCart.quantity + quantity,
                          }
                        : item,
                ),
            );
        } else {
            product.quantity = quantity;

            setCartItems([...cartItems, {...product}]);
        }
        toast.success(`${qty} ${product.name} added to the cart.`);
    };

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter(
            (item) => item._id !== product._id,
        );

        setTotalPrice(
            (prevTotalPrice) =>
                prevTotalPrice - foundProduct.price * foundProduct.quantity,
        );
        setTotalQuantities(
            (prevTotalQuantities) =>
                prevTotalQuantities - foundProduct.quantity,
        );
        setCartItems(newCartItems);
    };

    const toggleCartItemQuanitity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        const index = cartItems.findIndex((item) => item._id === id);

        if (value === 'inc') {
            setCartItems((prevCartItems) => [
                ...prevCartItems.slice(0, index),
                {...foundProduct, quantity: foundProduct.quantity + 1},
                ...prevCartItems.slice(index + 1, prevCartItems.length),
            ]);
            setTotalPrice(
                (prevTotalPrice) => prevTotalPrice + foundProduct.price,
            );
            setTotalQuantities(
                (prevTotalQuantities) => prevTotalQuantities + 1,
            );
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems((prevCartItems) => [
                    ...prevCartItems.slice(0, index),
                    {...foundProduct, quantity: foundProduct.quantity - 1},
                    ...prevCartItems.slice(index + 1, prevCartItems.length),
                ]);
                setTotalPrice(
                    (prevTotalPrice) => prevTotalPrice - foundProduct.price,
                );
                setTotalQuantities(
                    (prevTotalQuantities) => prevTotalQuantities - 1,
                );
            }
        }
    };

    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    };

    const decQty = () => {
        setQty((prevQty) => {
            if (prevQty - 1 < 1) return 1;

            return prevQty - 1;
        });
    };

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuanitity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export const useStateContext = () => useContext(Context);
