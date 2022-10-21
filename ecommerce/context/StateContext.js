import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';    //popup that appears when we add something to the cart

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);    //this will be used to include local storage which allows the user to come back to the app and have data in same state
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;     //the variable of the item we want to update within cart
    let index;

    //create the add to cart function
    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);  //the find() method will loop through the cartItems and see if item is in cart
        
        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if(checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if(cartProduct._id === product._id) return {
                    ...cartProduct,     //this uses the spread operator (...) which will expand the array
                    quantity: cartProduct.quantity + quantity
                };
                
            })

            setCartItems(updatedCartItems);
        }
        else {
            product.quantity = quantity;
            
            setCartItems([...cartItems, { ...product }]);
        }
        
        toast.success(`${qty} ${product.name} added to the cart.`);
    }

    //create function to remove item from cart
    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id)

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);
        setCartItems(newCartItems);
    }

    //create function to update item quantity in the cart view
    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);

        //delete the old item to add the updated item using the filter() method to include all items except for the item we are currently looking for
        const newCartItems = cartItems.filter((item) => item._id !== id)

        if(value === 'inc') {
            //update cartItems to conatin current cartItems as well as the added product + quantity
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1}]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1);
        }
        else if(value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1}]);
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1);
            }
        }
    }

    //create dynamic quantity update functions
    const incQty = () => {
        setQty((prevQty) => prevQty + 1)
    }

    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;

            return prevQty - 1; 
        });
    }

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
            toggleCartItemQuantity,
            onRemove,
            setCartItems,
            setTotalPrice,
            setTotalQuantities
          }}
        >
            {children}
        </Context.Provider>
    )
}


export const useStateContext = () => useContext(Context);   //allow us to use state like a hook