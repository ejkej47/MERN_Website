// frontend/components/Course/CourseDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';

function CourseDetail() {
  const { slug } = useParams();
  const [course, setCourse] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axiosInstance.get(`/courses/slug/${slug}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error('Error fetching course:', err));
  }, [slug]);

  const handlePurchase = async () => {
    try {
      const res = await axiosInstance.post(`/purchase/${course.id}`);
      setMessage(res.data.message);
    } catch (err) {
      console.error('Greška pri kupovini:', err);
      setMessage('Došlo je do greške prilikom kupovine.');
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div>
      <h2>{course.title}</h2>
      <p>{course.description}</p>
      <p><strong>Price:</strong> ${course.price}</p>
      <img
        src={course.imageUrl}
        alt={course.title}
        className="w-[560px] h-[315px] object-cover rounded-lg"
      />
      <button
        onClick={handlePurchase}
        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover transition"
      >
        Kupi kurs
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CourseDetail;
