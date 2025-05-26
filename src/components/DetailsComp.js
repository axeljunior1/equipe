import React from 'react';
import {Col, ListGroup, Row, Stack} from "react-bootstrap";

const DetailsComp = (props) => {




        return (
            <div className="card p-4 shadow">
                {props.title && <h3 className="card-title text-center">{props.title}</h3>}
                <div className="card-body">
                    <ListGroup variant={props.horizontal ? '' : "flush"} horizontal={props.horizontal} >
                        {props.lines && props.lines.map((line, i) => (
                            <ListGroup.Item key={i} variant={(i % 2 === 0) ? 'light' : 'secondary'}>
                                {line}
                            </ListGroup.Item>
                        ))}</ListGroup>
                </div>


                <Stack direction="horizontal" className="justify-content-end align-items-center" gap={1}>
                    {props.footerList && props.footerList.map((footer, i) => (
                        <div key={i} className="p-2">
                            {footer}
                        </div>
                    ))}
                </Stack>

            </div>
        );
    }
;

export default DetailsComp;