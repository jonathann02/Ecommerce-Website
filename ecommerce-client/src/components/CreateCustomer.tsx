import { useState, FormEvent } from "react"

export const CreateCustomer = () => {
    const [firstname, SetFirstname] = useState("")
    const [lastname, SetLastname] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, SetPostalCode] = useState("")
    const [country, setCountry] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const newCustomer = { 
            firstname, 
            lastname,
            email,
            phone,
            street_address: streetAddress,
            city,
            postal_code: postalCode,
            country,
            password
        }

        try {
            const response = await fetch("https://ecommerce-api-new-eight.vercel.app/customers", {
                method: "POST", 
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCustomer)
            })
            if (!response.ok) {
                throw new Error("Kunde inte skapa kund")
            }
            
            SetFirstname("")
            SetLastname("")
            setEmail("")
            setPhone("")
            setStreetAddress("")
            setCity("")
            SetPostalCode("")
            setCountry("")
            setPassword("")

            alert("Kund skapad")

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div>
            <h2>Skapa Kund</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Förnamn</label>
                    <input type="text" value={firstname} onChange={(e) => SetFirstname(e.target.value)}/>
                </div>

                <div>
                    <label>Efternamn</label>
                    <input type="text" value={lastname} onChange={(e) => SetLastname(e.target.value)}/>
                </div>

                <div>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>

                <div>
                    <label>Telefon:</label>
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </div>

                <div>
                    <label>Adress:</label>
                    <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)}/>
                </div>

                <div>
                    <label>Stad:</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)}/>
                </div>

                <div>
                    <label>Postnummer:</label>
                    <input type="text" value={postalCode} onChange={(e) => SetPostalCode(e.target.value)}/>
                </div>

                <div>
                    <label>Land:</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)}/>
                </div>

                <div>
                    <label>Lösenord:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                
                <button type="submit">Skapa ny kund</button>
            </form>
        </div>
    )
}