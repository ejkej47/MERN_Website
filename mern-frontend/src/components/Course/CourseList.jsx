// frontend/components/Course/CourseList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

function CourseList() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axiosInstance.get('/courses')
      .then(res => setCourses(res.data))
      .catch(err => console.error('Greška pri dohvatu kurseva:', err));
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {courses.map(course => (
        <Link 
          to={`/course/${course.slug}`} 
          key={course.id} 
          style={{ 
            border: '1px solid #ddd', 
            padding: '1rem', 
            width: '250px', 
            textDecoration: 'none', 
            color: 'inherit', 
            borderRadius: '8px' 
          }}
        >
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} 
          />
          <h3>{course.title}</h3>
          <p>{course.description.substring(0, 80)}...</p>
          <p><strong>Cena:</strong> ${course.price}</p>
        </Link>
      ))}
    </div>
  );
}

export default CourseList;
