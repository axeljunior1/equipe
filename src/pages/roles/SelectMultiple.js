import React, {useEffect, useState} from "react";
import { Form, Dropdown, Button, Badge, Stack } from "react-bootstrap";

const SelectMultiple = (props) => {

    const [selectedItems, setSelectedItems] = useState(props.selectedOptions ? props.selectedOptions.map(o => o.nom) : [] );
    const [options, setOptions] = useState(props.options? props.options : []);

    const handleSelect = (option) => {
        if (selectedItems.includes(option)) {
            setSelectedItems(selectedItems.filter(item => item !== option));
        } else {
            setSelectedItems([...selectedItems, option]);
        }
    };
    useEffect(() => {
        props.setSelectedOptions (selectedItems);
    },[selectedItems] )

    return (
        <>
            {/* Affichage des badges pour les éléments sélectionnés */}
            <Stack direction="horizontal" gap={3} className="bg-body-secondary">
                {selectedItems.map((item) => (
                    <Badge key={item} bg="secondary" className=" my-2">
                        {item}
                        <Button variant="outline-danger" className=" px-2 text-white py-0 ms-2" onClick={() => handleSelect(item)}>X</Button>
                    </Badge>
                ))}
            </Stack>

            {/* Dropdown avec toute l'option cliquable */}
            <Dropdown>
                <Dropdown.Toggle variant="outline-primary">
                    {props.title ? props.title : "Selection multiple"}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: "100%" }}>
                    {options?.map((option) => (
                        <Dropdown.Item key={option.id} onClick={() => handleSelect(option.nom)} className="d-flex align-items-center">
                            <Form.Check
                                type="checkbox"
                                label={option.nom}
                                checked={selectedItems.includes(option.nom)}
                                onChange={() => handleSelect(option.nom)}
                                className="me-2"
                                style={{ pointerEvents: "none" }} // Empêche le checkbox d'intercepter le clic
                            />
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default SelectMultiple;
