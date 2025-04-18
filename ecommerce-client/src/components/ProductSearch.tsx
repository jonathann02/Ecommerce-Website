import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { localProducts } from "../shop/mapping";
import { Link } from "react-router-dom";


interface IItemThumbnail {
    src: string; 
    width: number; 
    height: number; 
}


interface IItem {
    title: string; 
    link: string; 
    snippet: string; 
    pagemap: {
        cse_thumbnail?: IItemThumbnail[]; 
    }
}

export const ProductSearch = () => {
    const [searchText, setSearch] = useState(""); 
    const [items, setItems] = useState<IItem[]  | null>(null); 
    const [error, SetError] = useState(""); 

    const handleSearch = async (e: FormEvent) => {
        e.preventDefault(); 
        SetError(""); 

        if (searchText.length <= 3) {
            SetError("Skriv minst 4 tecken"); 
            return; 
        }

        try {
            const response = await axios.get("https://www.googleapis.com/customsearch/v1" ,{
                params: {
                    q: searchText, 
                    key: "AIzaSyAfR-x1onwhV8ukchdUvKrMOjhO2evonIk", 
                    cx: "84ad93792059744fd", 
                }
            })
            console.log(response.data);


            if (!response.data.items) {
                SetError("Inga träffar hittades"); 
                return; 
            }

            setItems(response.data.items); 
        } catch (error) {
            console.error(error); 
            SetError("Fel vid sökning")
        }
    }

    return (
        <div className="m-10">
            <h2 className="text-2xl font-bold mb-4">Sök Produkter</h2>

            <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                <input 
                type="text"
                placeholder="Sök produkter"
                className="border p-2 rounded w-full"
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}/>
                <button className="border py-2 px-4 rounded bg-purple-500 text-white" type="submit">Sök</button>
            </form>

            {error && <p className="text-red-500">{error}</p>}

            {items &&
            items.map((item) => {
                const found = localProducts.find((p) => item.title.toLowerCase().includes(p.keyword.toLowerCase())); 
                const linkTo = found ? found.localRoute : item.link; 

                return (
                    <div key={item.link} className="border p-4 mb-2 flex gap-2">
                    <div className="w-32">
                        <img
                        src={item.pagemap?.cse_thumbnail? item.pagemap.cse_thumbnail[0].src : "https://tacm.com/wp-content/uploads/2018/01/no-image-available.jpeg"}
                        alt={item.title}
                        className="object-cover h-32 w-32"/>
                    </div>

                    <div className="flex-grow">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="mb-2">{item.snippet}</p>


                        {found ? (
                            <Link to={linkTo} className="text-purple-600 underline">
                                Till Produkten
                            </Link>
                        ) : (

                        <a href={linkTo} target="_blank" rel="noopener noreferrer" className="text-purple-600 underline">
                            Till Produkten
                        </a>
                        )}
                    </div>
                    </div>
            ); 
})}
        </div>
    )
}