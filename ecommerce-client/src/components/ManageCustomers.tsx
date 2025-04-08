import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

interface ICustomer {
    id: number;
    firstname: string; 
    lastname: string; 
    email: string; 
}

export const ManageCustomers = () => {
const [customers, setCustomers] = useState<ICustomer[]>([]); 

    useEffect(() => {
        const fetchCustomers = async () => {
        try {
            const response = await fetch("https://ecommerce-api-new-eight.vercel.app/customers")
            if (!response.ok) {
                throw new Error("Kunde inte hämta kunder")
            }
            const data = await response.json() as ICustomer[]
            setCustomers(data)
        } catch (error) {
            console.error(error)
        }
    }

    fetchCustomers()
}, [])

const deleteCustomer = async (id: number) => {
    try {
        const response = await fetch(`https://ecommerce-api-new-eight.vercel.app/customers/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
        if (!response.ok) {
            throw new Error("Kunde inte ta bort kund")
        }
        setCustomers(customers.filter((customer) => customer.id !== id))
    } catch (error) {
        console.error(error)
    }
}


return (
    <div>
        <h2>Hantera Kunder</h2>
        <ul>
            {customers.map((customer) => (
                <li key={customer.id}>
                    {customer.firstname} ({customer.lastname}) ({customer.email})
                    <button onClick={() => deleteCustomer(customer.id)}>Ta Bort Kund</button>
                    <Link to={`/update-customer/${customer.id}`}>Uppdatera kundinformation</Link>
                </li>
            ))}
        </ul>
    </div>
)

}

