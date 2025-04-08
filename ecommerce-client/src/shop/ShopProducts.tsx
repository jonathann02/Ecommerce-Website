import { useEffect, useState } from 'react';
import { useCart } from "../hooks/useCart";
import { CartActionType, CartItem } from "../reducers/CartReducer";
import { Link } from "react-router-dom"
import { ProductSearch } from '../components/ProductSearch';

interface IProduct {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    stock: number;
}

export const ShopProducts = () => {
    const [products, setProducts] = useState<IProduct[]>([]);
    const { dispatch } = useCart()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
            const response = await fetch("https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/products");
            if (!response.ok) throw new Error ("Kunde inte hämta produkter"); 
            const data: IProduct[] = await response.json()
            setProducts(data)
        } catch (error) {
          console.error(error)
        }
    }
    fetchProducts()
    }, [])

    const handleAddToCart = (product: IProduct) => {
        dispatch({
            type: CartActionType.ADD_ITEM, 
            payload: new CartItem(product, 1)
        })
    }

    return (
        <div>
            <h2> Alla Produkter </h2>

            <ProductSearch/> 
            
            {products.map((product) => (
                <div key={product.id} >
                <h3>{product.name}</h3>
                <p>Pris: {product.price} kr</p>
                <Link to={`/product/${product.id}`}>Se detaljer</Link>

                <button onClick={() => handleAddToCart(product)}>Lägg till i varukorgen</button>
                </div>

            ))}
        </div>
    )
}