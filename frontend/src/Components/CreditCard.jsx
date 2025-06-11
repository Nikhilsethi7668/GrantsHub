import React, { useState, useEffect } from "react"

const CreditCard = ({ cardNumber, cardHolder, expiryDate, cvc }) => {
    const [maskedCardNumber, setMaskedCardNumber] = useState("")

    // Mask card number, leaving only the last 4 digits visible
    const maskCardNumber = (cardNumber) => {
        return cardNumber.replace(/\d(?=\d{4})/g, "*")
    }

    // Update the masked card number on mount
    useEffect(() => {
        if (cardNumber) {
            setMaskedCardNumber(maskCardNumber(cardNumber))
        }
    }, [cardNumber])

    return (
        <div className="w-96 h-56 m-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl relative text-white shadow-2xl transition-transform transform hover:scale-105">
            <img
                className="relative object-cover w-full h-full rounded-xl"
                src="https://images.unsplash.com/photo-1607863680198-23d4b2565df0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Credit card background"
            />
            <div className="w-full px-8 absolute top-8">
                <div className="flex justify-between">
                    <div className="">
                        <p className="font-light">Name</p>
                        <p className="font-medium tracking-widest">{cardHolder || "FULL NAME"}</p>
                    </div>
                    <img
                        className="w-14 h-14"
                        src="https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/chip.png"
                        alt="Card Chip"
                    />
                </div>
                <div className="pt-1">
                    <p className="font-light">Card Number</p>
                    <p className="font-medium tracking-more-wider">{maskedCardNumber || "#### #### #### ####"}</p>
                </div>
                <div className="pt-6 pr-6">
                    <div className="flex justify-between">
                        <div className="">
                            <p className="font-light text-xs">Expiry</p>
                            <p className="font-medium tracking-wider text-sm">{expiryDate || "MM/YY"}</p>
                        </div>
                        <div className="">
                            <p className="font-light text-xs">CVV</p>
                            <p className="font-bold tracking-more-wider text-sm">{cvc || "***"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreditCard

