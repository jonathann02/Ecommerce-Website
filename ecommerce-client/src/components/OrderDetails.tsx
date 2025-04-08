import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface IOrderItem {
    id: number; 
    product_id: number; 
    product_name: string; 
    quantity: number; 
    unit_price: number;
}

interface IOrder {
    id: number; 
    customer_id: number; 
    total_price: number;
    payment_status: string;
    payment_id: string;
    order_status: string; 
    created_at: string; 
    customer_firstname: string;
    customer_lastname: string;
    customer_email: string;
    order_items: IOrderItem[];
}


export const OrderDetails = () => {
    const { id } = useParams<{ id: string }>(); 
    const [order, setOrder] = useState<IOrder | null>(null);
  

    useEffect(() => {
        const fetchOrder = async () => {
            
            try {
                const response = await fetch(`https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/orders/${id}`)
                if (!response.ok) {
                    throw new Error("Kunde inte hämta order")
                }
                const data: IOrder = await response.json()
                setOrder(data)
            } catch (error) {
              console.error(error)
            }
        }
            fetchOrder()
    }, [id])

    const deleteOrderItem = async (itemId: number) => {
        try {
            const response = await fetch(`https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/order_items/${itemId}`, {
                method: "DELETE"
            })
            if (!response.ok) {
                throw new Error("Kunde inte ta bort order")
            }
            if (order) {
                const updatedItems = order.order_items.filter((item) => item.id !== itemId)
                setOrder({ ...order, order_items: updatedItems })
            }
        } catch (error) {
            console.error(error)
        }
    }

    const updateOrderQuantity = async (itemId: number, newQty: number) => {
        if (newQty < 1) {
            alert("Antalet måste vara större än 0")
            return; 
        }

        try {
            const response = await fetch(`https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/order_items/${itemId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ quantity: newQty })
            })
            if (!response.ok) {
                throw new Error("Kunde inte uppdatera order")
            }

            if (order) {
                const updatedItems = order.order_items.map((item) => 
                    item.id === itemId ? { ...item, quantity: newQty } : item
                )
                setOrder({ ...order, order_items: updatedItems })
            }
        }
        catch (error: unknown) {
            console.error(error)
           
        }
    }
    
    if (!order) {
        return <p>Hittade ingen order</p>
    }

    return (
        <div>
            <h2> Orderdetaljer </h2>
            <p> Order-ID: {order.id}</p>
            <p> Status: {order.order_status}</p>
            <p> Betalstatus: {order.payment_status}</p>
            <p> Order skapad: {order.created_at}</p>
            <p> Totalt pris: {order.total_price}</p>

            <h3> Kundinfo </h3>

            <p> {order.customer_firstname} {order.customer_lastname} </p>
            <p> {order.customer_email} </p>

            <h3> Beställning </h3>
            {order.order_items.length === 0 ? (
                <p> Inga produkter i ordern </p>
            ) : (
                <ul>
                    {order.order_items.map((item) => (
                        <li key={item.id}>
                            <p> Produkt: {item.product_name} </p>
                            <p> Pris per styck {item.unit_price} kr </p>
                            <p> Antal: {item.quantity} </p>
                            <button onClick={() => deleteOrderItem(item.id)}> Ta bort produkt </button>
                            <input type="number" value={item.quantity} onChange={(e) => updateOrderQuantity(item.id, Number(e.target.value))} />
                        </li>
                    ))}
                </ul>
            )}

            </div>
    )
}