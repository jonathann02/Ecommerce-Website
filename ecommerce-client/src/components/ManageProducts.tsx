import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

interface IProduct {
    id: number;
    name: string;
    price: number; 
    description: string;
    stock: number; 
    category: string;
    image: string;
}

export const ManageProducts = () => {
const [products, setProducts] = useState<IProduct[]>([]); 

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const response = await fetch("ecommerce-api-new-eight.vercel.app/products")
            if (!response.ok) {
                throw new Error("Kunde inte hämta produkter")
            }
            const data = await response.json() as IProduct[]
            setProducts(data)
        } catch (error) {
            console.error(error)
        }
    }

    fetchProducts()
}, [])

const deleteProduct = async (id: number) => {
    try {
        const response = await fetch(`https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/products/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
        if (!response.ok) {
            throw new Error("Kunde inte ta bort produkt")
        }
        setProducts(products.filter((product) => product.id !== id))
    } catch (error) {
        console.error(error)
    }
}

return (
    <div>
        <h2>Hantera Produkter</h2>
        <ul>
            {products.map((products) => (
                <li key={products.id}>
                    {products.name} ({products.price}kr) ({products.description})
                    <button onClick={() => deleteProduct(products.id)}>Ta Bort Produkt</button>
                    <Link to={`/update-product/${products.id}`}>Uppdatera produkt</Link>
                </li>
            ))}
        </ul>
    </div>
)

}