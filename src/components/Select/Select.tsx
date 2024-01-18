import React from "react";

import BasicInput from "../BasicInput/BasicInput";
import HoverCard from "../HoverCard/HoverCard";


export default function Select(props: any) {

    const initialData = [
        {
            id: 1,
            name: "A"
        },
        {
            id: 2,
            name: "B"
        },
        {
            id: 3,
            name: "C"
        },
        {
            id: 4,
            name: "D"
        }
    ];

    const handleInputClick = () => {
        console.log('click');
    }

    const handleInputChange = (e: any) => {
        console.log(e.target.value);
    }
    
    const handleInputClear = () => {
        console.log('clear');
    }

    const handleInputBlur = () => {
        console.log('blur');
    }

    return (<>
        <BasicInput onClick={handleInputClick} onChange={handleInputChange} onClear={handleInputClear} onBlur={handleInputBlur}/>
        <HoverCard>
            <div className="flex flex-col gap-2">
                {initialData.map((item) => {
                    return <div key={item.id} className="hover:bg-gray-200 p-2 rounded-lg">{item.name}</div>
                })}
            </div>
        </HoverCard>
    </>);
}


/* 
1) Input
2) Clear button
3) Dropdown card
4) Dropdown item
*/