import React, {useEffect, useRef, useState} from "react";
import search_icon from '/svg/search_icon.svg?url'
import {UserSearch} from "../types/ChatLayout.ts";


type Props = {
    setSearching: React.Dispatch<React.SetStateAction<boolean>>,
    searching: boolean,
    setSearchData: React.Dispatch<React.SetStateAction<UserSearch[]>>,
};

export default function SearchBar({setSearching,setSearchData,searching}:Props){
    const [search, setSearch] = useState<string>('')
    const searchBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        const url = import.meta.env.VITE_SERVER_IP ? import.meta.env.VITE_SERVER_IP+'/users' : '/users';
        if(search === ''){
            setSearching(false)
            setSearchData([])
        }
        if(!searching || search === '') return;
        fetch(url,
            {
                method: 'POST',
                headers: {
                    'authorization' : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({search}),
                credentials: 'include'
            }
            ).then(res=>res.json()).then(data => {
                console.log(data.users)
                setSearchData(data.users)
            })
    }, [search, searching, setSearchData, setSearching]);

    return(
        <>
            <div
                className='search-bar'
                ref={searchBarRef}
                // onBlur={() => {
                //     setSearching(false);
                //     setSearchData([]);
                // }}
            >
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder='Search'
                    value={search}
                    autoComplete={'off'}
                    onChange={(e)=> {
                        setSearch(e.target.value)
                        setSearching(true)
                    }}
                />
                <img src={search_icon} alt="Search Icon"/>
            </div>
        </>
    )
}