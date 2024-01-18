import React, { useState, useEffect, useRef } from "react";
import { Dropdown, Form, InputGroup, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

/* Local dependencies */
import { useData } from "../../providers/data/DataProvider";
import HoverCard from "../HoverCard/HoverCard";

import "./Select.css";


function Select({
    tableName
    , filters = {}
    , initialValue = ''
    , placeholder
    , fields
    , separators = []
    , pattern = '.*'
    , style = null
    , scale = 10
    , closeOnBlur = true

    , items = [] // reason: local array of options, avoid fetching data from database

    // Misc    
    , onChange = () => {} // reason: callback on input change
    , onOptionClick = () => {} // reason: callback on option click
    , onClearClick = () => {} // reason: callback on clear click
    , resetTrigger = null // reason: reset value

    // HoverCard
    , customX = null
    , customY = null
}) {

    const dataContext = useData();
    
    const componentRef = useRef(null);
    const inputRef = useRef(null);
    const clearRef = useRef(null);

    const [dropdownItemRefs, setDropdownItemRefs] = useState({}); // Reason: arg for HoverCard component
    const [hoveredRef, setHoveredRef] = useState(null); // Reason: arg for HoverCard component
    const [hoveredRow, setHoveredRow] = useState(null); // Reason: arg for HoverCard component
    
    const [data, setData] = useState(dataContext.getState(tableName));
    const [value, setValue] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);
    const [showSpinner, setShowSpinner] = useState(true);
    

    /* Hooks */
    useEffect(() => {
        if(closeOnBlur === false) return;

        const handleClickOutside = (event) => {
            if (componentRef.current && !componentRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [inputRef, closeOnBlur]);

    useEffect(() => {
        if(!hoveredRef) return;

        const id = data.filter((row) => buildOption(row) === hoveredRef.current.innerText)[0][`id_${tableName}`];
        const newRow = data.filter((row) => row[`id_${tableName}`] === id)[0];

        setHoveredRow(newRow); //eslint-disable-next-line
    }, [hoveredRef])

    useEffect(() => {
        if(resetTrigger === null) return; // reason: avoid trigger on first render
        setValue(''); // Reason: reset value when changeToValue changes
    }, [resetTrigger])

    useEffect(() => {
        if(items) {
            setData(items);
        }
    }, [])

    /* Methods */
    const buildOption = (row) => {
        if(!fields) return '';

        let option = '';

        fields.forEach((field, index) => {
            option += row[field];

            if(separators && separators[index]) {
                option += separators[index];    
            }

            if(!row[field]) {
                let size = 1;
                if(separators[index]) {
                    size = separators[index].length;
                }
                option = option.slice(0, size * -1);
            }

        });
        
        return option;  
    }
    
    /* API */
    async function retrieveData() {
        if (items.length > 0) return; // reason: avoid fetching data from database local array is provided
        if (isOpen === true) return;

        setShowSpinner(true);

        const { json } = await dataContext.fetchData(tableName, filters, false);

        setShowSpinner(false);

        const newData = json.data ? JSON.parse(json.data) : [];
        setData(newData);
        
        const newDropdownItemRefs = {};
        newData.forEach((_, index) => {
            newDropdownItemRefs[index] = React.createRef();
        });
        
        setDropdownItemRefs(newDropdownItemRefs);
        setIsOpen(true);
    }


    /* Handlers */
    const handleInputChange = (e) => {
        const regexObj = new RegExp(pattern);
        if(e.target.value!=='' && !regexObj.test(e.target.value)) return;

        setValue(e.target.value);
        onChange(e);

        setIsOpen(true);
    }

    const handleItemClick = (row) => {
        setValue(buildOption(row));
        onOptionClick(row);

        setIsOpen(false);
        inputRef.current.focus();
    }

    const handleClearClick = () => {
        if(!data) return;

        setValue('');
        onClearClick();

        setIsOpen(false);
    }


    return (
    <div ref={componentRef} className="flex-grow-1">
        <Dropdown show={isOpen}>
            <Dropdown.Toggle variant='outline' className='SelectToggle' style={{padding: '0px', width: '100%', border: 'none'}}>
                <InputGroup>
                    <Form.Control
                        className="SelectInput"
                        ref={inputRef}
                        required
                        type="text"
                        value={value}
                        placeholder={placeholder}
                        autoComplete="off"
                        onClick={() => {
                            if(value !== '') {
                                setValue('');
                            }
                            retrieveData();
                        }}
                        onChange={(e) => {
                            handleInputChange(e);
                        }}
                        onKeyDown={(e) => {
                            switch(e.key) {
                                case 'ArrowDown':
                                    retrieveData();
                                    setIsOpen(true);
                                    break;
                                case 'Tab':
                                    e.preventDefault();
                                    setIsOpen(false);
                                    clearRef.current.focus();
                                    break;
                                case 'Escape':
                                    setIsOpen(false);
                                    break;
                                default:
                                    break;
                            }
                        }}
                        style={{...style, fontSize: `${scale/10}em`}}
                    />

                    <FontAwesomeIcon
                        className="SelectClearButton"
                        ref={clearRef}
                        tabIndex="0"
                        icon={faXmark}
                        type="button"
                        style={{
                            border: '1px solid lightgray'
                            , borderTopRightRadius: '6px'
                            , borderBottomRightRadius: '6px'
                            , fontSize: `${scale/10}em`
                            , padding: `${scale}px`
                        }} 
                        onClick={handleClearClick}
                        onKeyDown={(e) => {
                            switch(e.key) {
                                case 'Enter':
                                    e.preventDefault();
                                    handleClearClick();
                                    inputRef.current.focus();
                                    break;
                                case ' ':
                                    e.preventDefault();
                                    handleClearClick();
                                    inputRef.current.focus();
                                    break;
                                default:
                                    break;
                            }
                        }}
                    />
                </InputGroup>
            </Dropdown.Toggle>

            <Dropdown.Menu style={{maxHeight: '290px', overflowY: 'auto', maxWidth: 'inherit', minWidth: '100%', padding: '0px 0px'}}>
                
                {showSpinner &&
                    <Spinner 
                        animation="border" 
                        size="sm" 
                        role="status" 
                        
                        style={{ 
                            margin: '10px 0px 5px 17px',
                        }}
                    />
                }

                {data && data.map((row, index) => {

                    const option = buildOption(row);

                    if (!option.toLocaleLowerCase().includes(value.toLocaleLowerCase())) return null; // Reason: filter options by value (input

                    return (
                        <Dropdown.Item
                            ref={dropdownItemRefs[index]}
                            className="SelectOption"
                            key={index} 
                            style={{
                                whiteSpace: 'pre-wrap'
                                , outline: 'none !important'
                            }} 
                            onClick={() => handleItemClick(row)}
                            onKeyDown={(e) => {
                                switch(e.key) {
                                    case 'ArrowDown':
                                        e.target.focus();
                                        break;
                                    case 'Enter':
                                        e.preventDefault();
                                        handleItemClick(row);
                                        setHoveredRef(null);
                                        break;
                                    case 'Escape':
                                        setIsOpen(false);
                                        inputRef.current.focus();
                                        break;
                                    case 'Tab':
                                        e.preventDefault();
                                        handleItemClick(row);
                                        setHoveredRef(null);
                                        break;
                                    default:
                                        inputRef.current.focus();
                                        break;
                                }
                            }}
                            onMouseOver={() => {
                                setHoveredRef(dropdownItemRefs[index]);
                            }}
                            onMouseOut={() => {
                                setHoveredRef(null);
                            }}
                        >
                            {option}
                        </Dropdown.Item>
                    )
                })}
            </Dropdown.Menu>
        </Dropdown>

        {hoveredRef &&
            <HoverCard 
                customX={customX}
                customY={customY}
            >
                {hoveredRow}
            </HoverCard>
        }
    </div>
    );
}

export default Select;