import Container from "react-bootstrap/esm/Container";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';

function SubjectBox({ subject, onAttendanceUpdate, onSubjectDeleted }) {
    const [attendanceData, setAttendanceData] = useState({
        total_classes: 0,
        attended_classes: 0,
        missed_classes: 0,
        attendance_percentage: 0
    });
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);

    const containerStyle = {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }

    const fetchAttendanceData = useCallback(async () => {
        if (!subject?.id) return;
        
        try {
            const response = await fetch(`http://localhost:8000/api/subjects/${subject.id}/attendance`);
            if (!response.ok) {
                throw new Error('Failed to fetch attendance data');
            }
            const data = await response.json();
            setAttendanceData(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching attendance data:', error);
            setError('Failed to load attendance data');
        }
    }, [subject?.id]);

    useEffect(() => {
        fetchAttendanceData();
    }, [fetchAttendanceData]);

    const getProgressColor = (percentage) => {
        return percentage >= 75 ? '#28a745' : '#dc3545';
    };

    const handleAttendance = async (status) => {
        try {
            setUpdatingStatus(status);
            const response = await fetch(`http://localhost:8000/api/subjects/${subject.id}/attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: status,
                    date: new Date().toISOString().split('T')[0],
                    subject_id: subject.id
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update attendance');
            }

            await fetchAttendanceData();
            if (onAttendanceUpdate) {
                onAttendanceUpdate();
            }
        } catch (error) {
            console.error('Error updating attendance:', error);
            setError(error.message || 'Failed to update attendance');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this subject?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/subjects/${subject.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete subject');
            }

            if (onSubjectDeleted) {
                onSubjectDeleted(subject.id);
            }
        } catch (error) {
            console.error('Error deleting subject:', error);
            setError('Failed to delete subject');
        }
    };

    if (!subject || !subject.id) {
        return null;
    }

    return (
        <Container className='mt-5 mb-5' style={containerStyle}>
            <Card>
                <Card.Body>
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}
                    <Row className="align-items-center">
                        <Col xs={12} md={4} className="text-center mb-3 mb-md-0">
                            <div style={{ width: '120px', margin: '0 auto' }}>
                                <CircularProgressbar
                                    value={attendanceData.attendance_percentage}
                                    text={`${attendanceData.attendance_percentage.toFixed(1)}%`}
                                    styles={buildStyles({
                                        pathColor: getProgressColor(attendanceData.attendance_percentage),
                                        textColor: getProgressColor(attendanceData.attendance_percentage),
                                        trailColor: '#d6d6d6',
                                    })}
                                />
                            </div>
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h3 className="mb-0">{subject.name}</h3>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={handleDelete}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </div>
                            <Row>
                                <Col xs={6} className="mb-2">
                                    <p className="mb-1">Total Classes:</p>
                                    <h5>{attendanceData.total_classes}</h5>
                                </Col>
                                <Col xs={6} className="mb-2">
                                    <p className="mb-1">Attended:</p>
                                    <h5>{attendanceData.attended_classes}</h5>
                                </Col>
                                <Col xs={6}>
                                    <p className="mb-1">Missed:</p>
                                    <h5>{attendanceData.missed_classes}</h5>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col xs={6}>
                                    <Button 
                                        variant={updatingStatus === 'attended' ? 'secondary' : 'success'}
                                        className="w-100"
                                        onClick={() => handleAttendance('attended')}
                                        disabled={updatingStatus === 'attended'}
                                    >
                                        {updatingStatus === 'attended' ? 'Updating...' : 'Attended'}
                                    </Button>
                                </Col>
                                <Col xs={6}>
                                    <Button 
                                        variant={updatingStatus === 'missed' ? 'secondary' : 'danger'}
                                        className="w-100"
                                        onClick={() => handleAttendance('missed')}
                                        disabled={updatingStatus === 'missed'}
                                    >
                                        {updatingStatus === 'missed' ? 'Updating...' : 'Missed'}
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default SubjectBox;
