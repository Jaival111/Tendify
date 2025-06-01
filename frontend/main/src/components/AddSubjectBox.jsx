import Container from "react-bootstrap/esm/Container";
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { fetchWithAuth } from '../utils/api';

function AddSubjectBox({ onSubjectAdded }) {
    const [showModal, setShowModal] = useState(false);
    const [subjectName, setSubjectName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const containerStyle = {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const newSubject = await fetchWithAuth('/api/subjects', {
                method: 'POST',
                body: JSON.stringify({ name: subjectName }),
            });

            if (newSubject && newSubject.id) {
                onSubjectAdded(newSubject);
                setShowModal(false);
                setSubjectName('');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (error) {
            console.error('Error adding subject:', error);
            setError(error.message || 'Failed to add subject. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Container className='mt-5 mb-5' style={containerStyle}>
                <Card 
                    className="text-center" 
                    style={{ cursor: 'pointer', height: '200px' }}
                    onClick={() => setShowModal(true)}
                >
                    <Card.Body className="d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon icon={faPlus} />
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showModal} onHide={() => {
                setShowModal(false);
                setError('');
                setSubjectName('');
            }}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Subject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Subject Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter subject name"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Adding...' : 'Add Subject'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddSubjectBox; 