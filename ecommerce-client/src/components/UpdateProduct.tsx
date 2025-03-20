import { useEffect, useState, FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"

export const UpdateProduct = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [price, setPrice] = useState<number | "">("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState<number | "">("")

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                const response = await fetch(`http://localhost:3000/products/${id}`)
                if (!response.ok) {
                    throw new Error("Kunde inte hämta produkt")
                }
                const data = await response.json() 
                setName(data.name)
                setPrice(data.price)
                setDescription(data.description)
                setImage(data.image)
                setCategory(data.category)
                setStock(data.stock)

            } catch (error) {
                console.error(error)
            }
        }

        if (id) {
            fetchProductById()
        }
    }, [id])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const updateProduct = { name, price, description, stock, category, image }

        try {
            const response = await fetch(`http://localhost:3000/products/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateProduct)
            })
            if (!response.ok) {
                throw new Error("Kunde inte uppdatera produkt")
            }
            navigate("/manage-products")
        } catch (error) {
          console.error(error)
        }

    }

    return (
        <div>
            <h2>Uppdatera Produkt</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Namn:</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}/>
                </div>
                <div>
                    <label>Pris: </label>
                    <input type="Number" value={price} onChange={e => setPrice(e.target.value ? parseFloat(e.target.value) : "")}/>
                </div>
                <div>
                    <label>Beskrivning:</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)}/>
                </div>
                <div>
                    <label>Bild:</label>
                    <input type="text" value={image} onChange={e => setImage(e.target.value)}/>
                </div>
                <div>
                    <label>Kategori:</label>
                    <input type="text" value={category} onChange={e => setCategory(e.target.value)}/>
                </div>
                <div>
                    <label>Kvantitet:</label>
                    <input type="Number" value={stock} onChange={e => setStock(e.target.value ? parseFloat(e.target.value) : "")}/>
                </div>
                <button type="submit">Uppdatera</button>
            </form>
        </div>
    )
}