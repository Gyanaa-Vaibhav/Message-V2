import {useEffect, useState} from "react";
import search_icon from '/svg/search_icon.svg?url'

export default function SearchBar(){
    const [search, setSearch] = useState<string>('')

    useEffect(() => {
        console.log(search)
    }, [search]);


    return(
        <>
            <div className='search-bar'>
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder='Search'
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />
                <img src={search_icon} alt="Search Icon"/>
            </div>
        </>
    )
}