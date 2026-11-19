
import { Modal } from "react-bootstrap";

export default function CustomModal({show,onHide,title, size="md",centered="true",centerTitle,description, children}){
    return(
        <Modal
            show={show}
            onHide={onHide}
            size={size}
            centered={centered}
        >
            <Modal.Header 
                closeButton
                className={`position-relative ${centerTitle ? "py-4": "py-2"}`}

            >
                <Modal.Title className={centerTitle ? "position-absolute top-50 start-50 translate-middle" : ""}>
                    {title}
                    <p className="text-muted fs-6 mb-0">{description}</p>
                </Modal.Title>
            </Modal.Header>

            {children}
        </Modal>
    )
}