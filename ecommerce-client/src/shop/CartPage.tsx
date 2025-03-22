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

            let customerId: number | null = null
            const checkResponse = await fetch(`http://localhost:3000/customers/email/${email}`)
            if (checkResponse.status === 404) {

                const newCustomerData = {
                    firstname: firstName, 
                    lastName: lastName, 
                    email: email, 
                    phone: phone, 
                    street_address: streetAddress, 
                    postal_code: postalCode, 
                    city: city, 
                    country: country
                }

                const createResponse = await fetch("http://localhost:3000/customers", {
                    method: "POST", 
                    headers: { "Content-Type": "application/json" }, 
                    body: JSON.stringify(newCustomerData)
                })
                if (!createResponse.ok) {
                    throw new Error ("Could not create customer")  
                }
                const createdCustomer = await createResponse.json()
                customerId = createdCustomer.insertId || createdCustomer.id
            } else if (checkResponse.ok) {
                const existingCustomer = await checkResponse.json()
                customerId = existingCustomer.id
            }
            

   else {
    throw new Error("failed to check customer by email")

   }

   if (!customerId) throw new Error ("No customer ID found")


    const handleCreateOrder = async () => {
        try {
            const orderItems = cart.map((item) => ({
                product_id: item.product.id, 
                product_name: item.product.name, 
                quantity: item.quantity, 
                unit_price: item.product.price
            }))

            const newOrder = {
                customer_id: 1, 
                payment_status: "pending",
                payment_id: "", 
                order_status: "processing", 
                order_items: orderItems
            }

            const response = await fetch("http://localhost:3000/orders", {
                method: "POST", 
                headers: { "Content-Type": "application/json" }, 
                body: JSON.stringify(newOrder)
            })
            if (!response.ok) {
                throw new Error("Kunde inte skapa en order")
            }

            alert("Order skapad")
            handleResetCart()
        } catch (error) {
            console.error(error)
            alert("Något gick fel")
        }
    }

    return (
        <div>
            <h2>Varukorg</h2>

            {cart.length === 0 ? (
                <p>Vaurkorgen är tom</p>
            ) : (

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

            )}

            <p>Totalpris: {totalCartPrice} kr</p>
            <button onClick={handleResetCart}>Töm Varukorgen</button>

            {cart.length > 0 && (
                <button onClick={handleCreateOrder}>Köp</button>
            )}
        </div>
    )
}