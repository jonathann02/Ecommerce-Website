import { useCart } from "../hooks/useCart"
import { CartActionType, CartItem } from "../reducers/CartReducer"
import { useState, useEffect } from "react"

export const CartPage = () => {
    const { cart, dispatch } = useCart()


    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [postalCode, setPostalCode] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")

    useEffect(() => {
        const data = localStorage.getItem("checkoutCustomer")
        if (data) {
            const parsed = JSON.parse(data)
            setFirstName(parsed.firstName || "")
            setLastName(parsed.lastName || "")
            setEmail(parsed.email || "")
            setPhone(parsed.phone || "")
            setStreetAddress(parsed.streetAddress || "")
            setPostalCode(parsed.postalCode || "")
            setCity(parsed.city || "")
            setCountry(parsed.country || "")
        }
    }, [])

    useEffect(() => {
        const data = {
            firstName, lastName, email, phone, streetAddress, postalCode, city, country
        }

        localStorage.setItem("checkoutCustomer", JSON.stringify(data))
    }, [firstName, lastName, email, phone, streetAddress, postalCode, city, country])
    

        const totalCartPrice = cart.reduce((total, item: CartItem) => {
        return total + item.product.price * item.quantity
    }, 0)

    const handleChangeQuantity = (item: CartItem, quantityChange: number) => {
        dispatch({
            type: CartActionType.CHANGE_QUANTITY, 
            payload: new CartItem(item.product, quantityChange)
        })
    }

    const handleRemoveItem = (item: CartItem) => {
        dispatch({
            type: CartActionType.REMOVE_ITEM, 
            payload: item
        })
    }

    const handleResetCart = () => {
        dispatch({
            type: CartActionType.RESET_CART, 
            payload: null
        })
    }

    const handleProceedToPayment = async () => {
        try {
            if (!firstName || !lastName || !email || !streetAddress || !postalCode || !city ||!country) {
                alert ("Fill in all required fields")
                return
            }
            if (cart.length === 0) {
                alert("Cart is empty")
                return
            }
       

            
            let checkResponse = await fetch(`http://localhost:3000/customers/email/${email}`)
            if (checkResponse.status === 404) {

                const newCustomerData = {
                    firstname: firstName, 
                    lastname: lastName, 
                    email: email, 
                    phone: phone, 
                    street_address: streetAddress, 
                    postal_code: postalCode, 
                    city: city, 
                    country: country,
                    password: ""
                }

                const createResponse = await fetch("http://localhost:3000/customers", {
                    method: "POST", 
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify(newCustomerData)
                })
                if (!createResponse.ok) {
                    throw new Error ("Could not create customer")  
                }
                

                checkResponse = await fetch(`http://localhost:3000/customers/email/${email}`)
                if (!checkResponse.ok) {
                    throw new Error("Customer not found")
                }
            } else if (!checkResponse.ok) {
                throw new Error("Failed to check customer by email")
            }

            const existingCustomer = await checkResponse.json()
            const customerId = existingCustomer.id
            if (!customerId) {
                throw new Error("No customer ID found")
            }


            const orderItems = cart.map(item => ({
                product_id: item.product.id, 
                product_name: item.product.name, 
                quantity: item.quantity, 
                unit_price: item.product.price
            }))

            const newOrder = {
                customer_id: customerId, 
                payment_status: "Unpaid",
                payment_id: "", 
                order_status: "Pending", 
                order_items: orderItems
            }

            const createOrderResponse = await fetch("http://localhost:3000/orders", {
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(newOrder)
            })
            if (!createOrderResponse.ok) {
                throw new Error("Kunde inte skapa en order")
            }


            const orderData = await createOrderResponse.json()
            const orderId = orderData.id 

            if (!orderId) {
                throw new Error("No order ID returned")
            }

           


    const lineItems = cart.map(item => ({
        price_data: {
            currency: "sek",
            product_data: { name: item.product.name }, 
            unit_amount: item.product.price * 100
        }, 
        quantity: item.quantity
    }))

    const stripePayload = {
        order_id: orderId, 
        line_items: lineItems
    }

    const stripeResponse = await fetch("http://localhost:3000/stripe/create-checkout-session-hosted", {
        method: "POST", 
        headers: { "Content-Type": "application/json"}, 
        body: JSON.stringify(stripePayload)
    })
    if (!stripeResponse.ok) {
        throw new Error("Error")
    }
    const stripeData = await stripeResponse.json()
    if (!stripeData.checkout_url) {
        throw new Error("No checkout URL returned from Stripe")
    }

    window.location.href = stripeData.checkout_url 



    } catch (error: any) {
    console.error(error)
    alert(error.message)
}
}
    


if (cart.length === 0) {
    return<p>Cart is empty</p>
}



    return (
        <div>
            <h2>Varukorg</h2>

                <ul>
                    {cart.map((item) => (
                        <li key={item.product.id}>
                            {item.product.name} - {item.quantity} st x {item.product.price} kr

                            <button onClick={() => handleChangeQuantity(item, 1)}>+1</button>
                            <button onClick={() => handleChangeQuantity(item, -1)}>-1</button>
                            <button onClick={() => handleRemoveItem(item)}>Ta bort</button>
                        </li>

                    )
                )}
                </ul>


            <p>Totalpris: {totalCartPrice} kr</p>
            <button onClick={handleResetCart}>Töm Varukorgen</button>

            

            <h3>Shipping Address</h3>
            <label>First Name</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} />

            <label>Last Name</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} />

            <label>Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} />

            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} />


            <label>Street Address</label>
            <input value={streetAddress} onChange={e => setStreetAddress(e.target.value)} />

            <label>Postal Code</label>
            <input value={postalCode} onChange={e => setPostalCode(e.target.value)} />


            <label>City</label>
            <input value={city} onChange={e => setCity(e.target.value)} />


            <label>Country</label>
            <input value={country} onChange={e => setCountry(e.target.value)} />

            <button onClick={handleProceedToPayment}>Proceed to payment</button>
        </div>

        )
    }

