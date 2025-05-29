import React from "react";
import {Table} from "react-bootstrap";

const DataTableComp = ({data = [], columns = [], entetes = []}) => {
    return (
        <div>
            {entetes && entetes.length > 0 && (
                entetes.map((item, index) => (
                    <h6 key={index}>
                        {item.title} : <strong className="text-danger">{item.value}</strong>
                    </h6>
                ))
            )}
            {data && data.length > 0 && columns && columns.length > 0 &&
                <Table striped bordered hover responsive="sm">
                    <thead>
                    <tr className={"text-center align-middle "}>
                        {columns.map((col, index) => (
                            <th key={'th-' + index}
                                className={"text-center align-middle index-" + index}>{col.header}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((item, index) => (
                        <tr key={'tr-' + index} className={"text-center align-middle rowIndex-" + index}>
                            {columns.map((col, colIndex) => (
                                <td key={'td-' + index * 10 + colIndex} className={"text-center align-middle "}>
                                    {col.render ? col?.render(item[col?.accessor], item) : item[col?.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            }
        </div>
    );
};

export default DataTableComp;
