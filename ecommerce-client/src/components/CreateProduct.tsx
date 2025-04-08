import { useState, FormEvent } from "react"

export const CreateProduct = () => {
    const [name, setName] = useState("")
    const [price, setPrice] = useState<number>(0)
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState<number>(0)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const newProduct = { name, price, description, image, category, stock }

        try {
            const response = await fetch("https://ecommerce-api-new-eight.vercel.app/products", {
                method: "POST", 
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            })

            if (!response.ok) {
                throw new Error("Kunde inte skapa ny produkt")
            }


            setName("")
            setPrice(0)
            setDescription("")
            setImage("")
            setStock(0)
            setCategory("")

            alert("Produkt skapad")

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h2>Skapa Produkt</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Produktnamn</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>

                <div>
                    <label>Beskrivning:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>

                <div>
                    <label>Bild:</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)}/>
                </div>

                <div>
                <label>Kvantitet</label>
                <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))}/>
                </div>

                <div>
                    <label>Kategori:</label>
                    <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}/>
                </div>

                <div>
                    <label>Pris:</label>
                    <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))}/>
                </div>
            
                <button type="submit">Skapa ny produkt</button>
            </form>
        </div>
    )
}