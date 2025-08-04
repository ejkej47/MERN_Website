import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import SkeletonBox from '../SkeletonBox';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/courses')
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Greška pri dohvatu kurseva:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-[250px] p-4 border rounded">
            <SkeletonBox className="w-full h-[150px] mb-2" />
            <SkeletonBox className="w-3/4 h-4 mb-1" />
            <SkeletonBox className="w-1/2 h-4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {courses.map(course => (
        <Link 
          to={`/course/${course.slug}`} 
          key={course.id} 
          className="w-[250px] p-4 border rounded text-dark no-underline hover:shadow"
        >
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full h-[150px] object-cover rounded mb-2"
          />
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-600">{course.description.substring(0, 80)}...</p>
          <p className="text-sm font-bold mt-1">Cena: ${course.price}</p>
        </Link>
      ))}
    </div>
  );
}

export default CourseList;
