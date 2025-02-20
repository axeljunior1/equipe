import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const DataTableComp = ({ data, columns, entetes }) => {
    return (
        <div>
            {entetes && entetes.length>0 && (
                entetes.map((item) => (
                    <h6>
                        {item.title} : <strong className="text-danger">{item.value}</strong>
                    </h6>
                ))
            )}
            <Table striped bordered hover>
                <thead>
                <tr className={"text-center align-middle " }>
                    {columns.map((col, index) => (
                        <th key={index} className={"text-center align-middle index-" + index}>{col.header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {data.map((item, rowIndex) => (
                    <tr key={rowIndex} className={"text-center align-middle rowIndex-" + rowIndex}>
                        {columns.map((col, colIndex) => (
                            <td key={rowIndex*10+ colIndex} className={"text-center align-middle colIndex-" + colIndex}>
                                {col.render ? col.render(item[col.accessor], item) : item[col.accessor]}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default DataTableComp;
