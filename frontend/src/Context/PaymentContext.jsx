import React, { useContext, useState, createContext } from 'react';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [paymentInProgress, setPaymentInProgress] = useState(false);

    return (
        <PaymentContext.Provider value={{ paymentInProgress, setPaymentInProgress }}>
            {children}
        </PaymentContext.Provider>
    );
};
