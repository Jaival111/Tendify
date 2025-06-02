import Container from "react-bootstrap/esm/Container";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { fetchWithAuth } from '../utils/api';

function SubjectBox({ subject, onAttendanceUpdate, onSubjectDeleted }) {
    const [attendanceData, setAttendanceData] = useState({
        total_classes: 0,
        attended_classes: 0,
        missed_classes: 0,
        attendance_percentage: 0
    });
    const [error, setError] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(null);
    const [currentDateAttendance, setCurrentDateAttendance] = useState(null);

    const containerStyle = {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '0px',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
    }

    const fetchAttendanceData = useCallback(async () => {
        if (!subject?.id) return;
        
        try {
            const data = await fetchWithAuth(`/api/subjects/${subject.id}/attendance`);
            setAttendanceData(data);
            
            // Fetch current date's attendance status
            const today = new Date().toISOString().split('T')[0];
            const currentAttendance = await fetchWithAuth(`/api/subjects/${subject.id}/attendance/status?date=${today}`);
            setCurrentDateAttendance(currentAttendance.status);
            
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
            const today = new Date().toISOString().split('T')[0];
            
            await fetchWithAuth(`/api/subjects/${subject.id}/attendance`, {
                method: 'POST',
                body: JSON.stringify({
                    status: status,
                    date: today,
                    subject_id: subject.id
                }),
            });

            setCurrentDateAttendance(status);
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

    const handleRemoveAttendance = async () => {
        try {
            setUpdatingStatus('removing');
            const today = new Date().toISOString().split('T')[0];
            
            await fetchWithAuth(`/api/subjects/${subject.id}/attendance`, {
                method: 'DELETE',
                body: JSON.stringify({
                    date: today,
                    subject_id: subject.id
                }),
            });

            setCurrentDateAttendance(null);
            await fetchAttendanceData();
            if (onAttendanceUpdate) {
                onAttendanceUpdate();
            }
        } catch (error) {
            console.error('Error removing attendance:', error);
            setError(error.message || 'Failed to remove attendance');
        } finally {
            setUpdatingStatus(null);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this subject?')) {
            return;
        }

        try {
            await fetchWithAuth(`/api/subjects/${subject.id}`, {
                method: 'DELETE',
            });

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
                                {currentDateAttendance ? (
                                    <Col xs={12}>
                                        <Button 
                                            variant="warning"
                                            className="w-100"
                                            onClick={handleRemoveAttendance}
                                            disabled={updatingStatus === 'removing'}
                                        >
                                            {updatingStatus === 'removing' ? 'Removing...' : 'Remove Attendance'}
                                        </Button>
                                    </Col>
                                ) : (
                                    <>
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
                                    </>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    )
}

export default SubjectBox;
