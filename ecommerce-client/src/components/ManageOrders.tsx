import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface IOrder {
    id: number;
    customer_id: number; 
    total_price: number; 
    payment_status: string; 
    payment_id: string; 
    order_status: string; 
    created_at: string; 
}

export const ManageOrders = () => {
const [orders, setOrders] = useState<IOrder[]>([]); 

    useEffect(() => {
        const fetchOrders = async () => {
        try {
            const response = await fetch("https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/orders")
            if (!response.ok) {
                throw new Error("Kunde inte hämta ordrar")
            }
            const data = await response.json() as IOrder[]
            setOrders(data)
        } catch (error) {
            console.error(error)
        }
    }

    fetchOrders()
}, [])


const handleUpdateStatus = async (orderId: number) => {
    try {
        const response = await fetch(`https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/orders/${orderId}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_status: "skickad" })
        })
        if (!response.ok) throw new Error("Kunde inte uppdatera orderstatus")

        const updated = orders.map((order) => 
        order.id === orderId ? { ...order, order_status: "skickad"} : order
    )
        setOrders(updated)
        } catch (error) {
        console.error(error)
        }
    }

const deleteOrder = async (id: number) => {
    try {
        const response = await fetch(`https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/orders/${id}`, {
            method: "DELETE",
            credentials: "include"
    })
    if (!response.ok) throw new Error("Kunde inte ta bort order")
        setOrders(orders.filter((order) => order.id !== id))
    } catch (error) {
        console.error(error)
    }

}


return (
    <div>
        <h2>Hantera Ordrar</h2>
        <ul>
            {orders.map((orders) => (
                <li key={orders.id}>
                    <p>Order: {orders.id}</p>
                    <p>Kund-ID: {orders.customer_id}</p>
                    <p>Pris: {orders.total_price}</p>
                    <p>Orderstatus{orders.order_status}</p>

                    <button onClick={() => handleUpdateStatus(orders.id)}>Ändra status</button>
                    <button onClick={() => deleteOrder(orders.id)}>Ta bort</button>

                    <Link to={`/orders/${orders.id}`}>Se orderdetaljer</Link>
                </li>
            ))}
        </ul>
    </div>
)

}