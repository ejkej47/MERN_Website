import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import SkeletonBox from '../QoL/SkeletonBox';

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-4 border rounded w-full">
            <SkeletonBox className="w-full h-[150px] rounded mb-2" />
            <SkeletonBox className="w-3/4 h-5 mb-1 rounded" />
            <SkeletonBox className="w-full h-4 mb-1 rounded" />
            <SkeletonBox className="w-5/6 h-4 mb-1 rounded" />
            <SkeletonBox className="w-1/3 h-4 mt-2 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <Link 
          to={`/course/${course.slug}`} 
          key={course.id} 
          className="p-4 border rounded text-dark no-underline hover:shadow transition w-full"
        >
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="w-full h-[150px] object-cover rounded mb-2"
          />
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-sm text-gray-600 mb-1">
            {course.description.substring(0, 80)}...
          </p>
          <p className="text-sm text-gray-700">
            Broj lekcija: {course.lessonCount ?? 'N/A'}
          </p>
          <p className="text-sm font-bold mt-1">Cena: ${course.price}</p>
        </Link>
      ))}
    </div>
  );
}

export default CourseList;
