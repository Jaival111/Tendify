import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import AddSubjectBox from '../components/AddSubjectBox';
import SubjectBox from '../components/SubjectBox';
import { fetchWithAuth } from '../utils/api';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await fetchWithAuth('/api/subjects');
      setSubjects(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError('Failed to load subjects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectAdded = (newSubject) => {
    if (newSubject && newSubject.id) {
      setSubjects(prevSubjects => [...prevSubjects, newSubject]);
    }
  };

  const handleSubjectDeleted = (deletedSubjectId) => {
    setSubjects(prevSubjects => prevSubjects.filter(subject => subject.id !== deletedSubjectId));
  };

  if (!user) {
    return (
      <Container className="mt-5">
        <div className="text-center">
          <h1 className="display-4 mb-4">Welcome to Tendify!</h1>
          <p className="lead mb-5">
            Track your class attendance, monitor your progress, and stay on top of your academic goals.
          </p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <h2 className="h4 mb-4">Get Started</h2>
                  <div className="d-grid gap-3">
                    <Button 
                      variant="dark" 
                      size="lg" 
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </Button>
                    <Button 
                      variant="outline-dark" 
                      size="lg"
                      onClick={() => navigate('/signup')}
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="h5 mb-3">Track Attendance</h3>
                  <p className="text-muted">Easily mark your attendance for each class and subject.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="h5 mb-3">Monitor Progress</h3>
                  <p className="text-muted">View your attendance statistics and stay on track.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="h5 mb-3">Stay Organized</h3>
                  <p className="text-muted">Manage multiple subjects and keep everything in one place.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  return (
    <div>
      <AddSubjectBox onSubjectAdded={handleSubjectAdded} />
      {subjects && subjects.length > 0 ? (
        subjects.map((subject) => (
          <SubjectBox 
            key={subject.id} 
            subject={subject} 
            onAttendanceUpdate={fetchSubjects}
            onSubjectDeleted={handleSubjectDeleted}
          />
        ))
      ) : (
        <div className="text-center mt-3">No subjects added yet. Click the plus icon to add a subject.</div>
      )}
    </div>
  );
}

export default HomePage;