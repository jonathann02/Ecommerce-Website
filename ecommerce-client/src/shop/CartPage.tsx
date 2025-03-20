import { useCart } from "../hooks/useCart"
import { CartActionType, CartItem } from "../reducers/CartReducer"

export const CartPage = () => {
    const { cart, dispatch } = useCart()

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