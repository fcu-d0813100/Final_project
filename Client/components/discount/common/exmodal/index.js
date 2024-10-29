// MyVerticallyCenteredModal.js
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function ExModal({ show, onHide, onSave, title, body }) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* <h4>{body.title}</h4> */}
                <p>{body.content}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onSave}>Save changes</Button>
                <Button onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ExModal;

