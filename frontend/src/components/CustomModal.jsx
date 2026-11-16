
import { Modal } from "react-bootstrap";

export default function CustomModal({show,onHide,title, size="md",centered="true",centerTitle, children}){
    return(
        <Modal
            show={show}
            onHide={onHide}
            size={size}
            centered={centered}
        >
            <Modal.Header 
                closeButton
                className={`position-relative ${centerTitle ? "py-4": ""}`}

            >
                <Modal.Title className={centerTitle ? "position-absolute top-50 start-50 translate-middle" : ""}>
                    {title}
                </Modal.Title>
            </Modal.Header>

            {children}
        </Modal>
    )
}