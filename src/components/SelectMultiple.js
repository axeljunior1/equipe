import React, {useEffect, useState} from "react";
import {Badge, Button, Dropdown, Form, Stack} from "react-bootstrap";

const SelectMultiple = (props) => {

    const [selectedItems, setSelectedItems] = useState(props.selectedOptions ? props.selectedOptions.map(o => o):
                [{}]
        )
    ;
    const [options, setOptions] = useState(props.options ? props.options : []);

    const handleSelect = (option) => {
        setSelectedItems(prevItems =>
            prevItems.some(item => item.id === option.id)
                ? prevItems.filter(item => item.id !== option.id) // Supprime si déjà sélectionné
                : [...prevItems, option] // Ajoute l'objet entier sinon
        );
    };

    useEffect(() => {
        props.setSelectedOptions(selectedItems);
    }, [selectedItems])

    useEffect(() => {
        console.log()
        console.log(props.selectedOptions)
        console.log(props.options)
    })

    return (
        <>
            {/* Affichage des badges pour les éléments sélectionnés */}
            <Stack direction="horizontal" gap={3} className="bg-body-secondary">
                {selectedItems.map((item, index) => (
                    <Badge key={index} bg="secondary" className=" my-2">
                        {item?.nom}
                        <Button variant="outline-danger" className=" px-2 text-white py-0 ms-2"
                                onClick={() => handleSelect(item)}>X</Button>
                    </Badge>
                ))}
            </Stack>

            {/* Dropdown avec toute l'option cliquable */}
            <Dropdown>
                <Dropdown.Toggle variant="outline-primary">
                    {props.title ? props.title : "Selection multiple"}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{width: "100%"}}>
                    {options?.map((option,index) => (
                        <Dropdown.Item key={index} onClick={() => handleSelect(option)}
                                       className="d-flex align-items-center">
                            <Form.Check
                                type="checkbox"
                                label={option.nom}
                                checked={selectedItems.some(item => item?.id === option.id)}
                                onChange={() => handleSelect(option)}
                                className="me-2"
                                style={{pointerEvents: "none"}} // Empêche le checkbox d'intercepter le clic
                            />
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default SelectMultiple;
