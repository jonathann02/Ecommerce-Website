import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

interface IOrder {
    id: number
    payment_id: string; 
    payment_status: string; 
    order_status: string; 
    order_items: {
        product_name: string
        quantity: number
        unit_price: number
    }[]
}

export const OrderConfirmation = () => {
    const [order, setOrder] = useState<IOrder | null>(null)
    const location = useLocation()

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const sessionId = params.get("session_id")

        if (sessionId) {
            fetch(`https://ecommerce-api-new-eight.vercel.app/order-confirmation?session_id=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                setOrder(data)
            })
            .catch(e => console.log(e))
        }

        localStorage.removeItem("cart")
        localStorage.removeItem("checkoutCustomer")
    }, [location.search])

    if (!order) {
        return <p>Loading order confirmation...</p>
    }

    return (
        <div>
            <h2>Order Confirmation</h2>
            <p> Order ID: {order.id}</p>
            <p> Payment status: {order.payment_status}</p>
            <p>Order status: {order.order_status}</p>

            <h3>Your order</h3>
            <ul>
                {order.order_items.map((item, i) => (
                    <li key={i}>
                        {item.product_name} * {item.quantity} {item.unit_price}
                    </li>
                ))}
            </ul>
        </div>
    )
}