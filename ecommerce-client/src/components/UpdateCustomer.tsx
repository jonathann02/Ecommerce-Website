import { useEffect, useState, FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"

export const UpdateCustomer = () => {
    const { id } = useParams()
    const navigate = useNavigate()
   
    const [firstname, SetFirstname] = useState("")
    const [lastname, SetLastname] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [city, setCity] = useState("")
    const [postalCode, SetPostalCode] = useState("")
    const [country, setCountry] = useState("")
    const [password, setPassword] = useState("")


    useEffect(() => {
        const fetchCustomerById = async () => {
            try {
                const response = await fetch(`https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/customers/${id}`)
                if (!response.ok) {
                    throw new Error("Kunde inte hämta kund")
                }
                const data = await response.json() 
                SetFirstname(data.firstname)
                SetLastname(data.lastname)
                setEmail(data.email)
                setPhone(data.phone)
                setStreetAddress(data.street_address)
                setCity(data.city)
                SetPostalCode(data.postal_code)
                setCountry(data.country)
                setPassword(data.password)

            } catch (error) {
                console.error(error)
            }
        }

        if (id) {
            fetchCustomerById()
        }
    }, [id])

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const updateCustomer = { 

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
            const response = await fetch(`https://ecommerce-api-qj50qevs5-jonathans-projects-01da1bd7.vercel.app/customers/${id}`, {
                method: "PATCH", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateCustomer)
            })
            if (!response.ok) {
                throw new Error("Kunde inte uppdatera kund")
            }
            navigate("/manage-customers")
           } catch (error) {
            console.error(error)
           }
        }


    return (
        <div>
            <h2>Uppdatera kund</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Förnamn:</label>
                    <input type="text" value={firstname} onChange={e => SetFirstname(e.target.value)}/>
                </div>
                
                <div>
                    <label>Efternamn:</label>
                    <input type="text" value={lastname} onChange={e => SetLastname(e.target.value)}/>
                </div>

                <div>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
                </div>

                <div>
                    <label>Telefon:</label>
                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)}/>
                </div>

                <div>
                    <label>Adress:</label>
                    <input type="text" value={streetAddress} onChange={e => setStreetAddress(e.target.value)}/>
                </div>

                <div>
                    <label>Stad:</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)}/>
                </div>

                <div>
                    <label>Postnummer:</label>
                    <input type="text" value={postalCode} onChange={e => SetPostalCode(e.target.value)}/>
                </div>

                <div>
                    <label>Land:</label>
                    <input type="text" value={country} onChange={e => setCountry(e.target.value)}/>
                </div>

                <div>
                    <label>Lösenord:</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
                </div>

                
                <button type="submit">Uppdatera</button>
            </form>
        </div>
    )
}