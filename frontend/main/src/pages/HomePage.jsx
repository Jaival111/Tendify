import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import AddSubjectBox from '../components/AddSubjectBox';
import SubjectBox from '../components/SubjectBox';

function HomePage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSubjects();
    }
  }, [user]);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/subjects');
      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }
      const data = await response.json();
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
    return <h1 className='text-center mt-5'>Please Login to Continue!</h1>;
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