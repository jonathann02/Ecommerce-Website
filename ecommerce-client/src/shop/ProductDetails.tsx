import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useCart } from "../hooks/useCart"
import { CartActionType, CartItem } from "../reducers/CartReducer"

interface IProduct {
    id: number; 
    name: string; 
    price: number
    stock: number; 
    image: string; 
    description: string
}

export const ProductDetails = () => {
    const { id } = useParams()
    const [product, setProduct] = useState<IProduct | null>(null)
    const { dispatch } = useCart()

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/products/${id}`)
                if (!response.ok) throw new Error ("Kunde inte hämta produkt")
                    const data: IProduct = await response.json()
                    setProduct(data)
                } catch (error) {
                    console.error(error)
                }
            }
            if (id) fetchProduct()
        }, [id]) 


        const handleAddToCart = () => {
            if (product) {
                dispatch({
                    type: CartActionType.ADD_ITEM, 
                    payload: new CartItem(product, 1)
                })
            }
        }

        if (!product) {
            return <div>Laddar produkten...</div>
        }

        return (
            <div>
                <h2>{product.name}</h2>
                <p>Pris: {product.price} kr</p>
                <p>Beskrivning: {product.description}</p>
                <img src={product.image}></img>
                <button onClick={handleAddToCart}>Lägg i varukorgen</button>
            </div>
        )

    }