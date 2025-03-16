import {useZxing} from 'react-zxing';

const BarcodeScanner = (props) => {
    const { ref } = useZxing({
        onDecodeResult(result) {
            props.onScan(result.getText());
        },
    });

    return (
        <>
            <video ref={ref} width={props.width||100} height={props.height} />
        </>
    );
};

export default BarcodeScanner;
