export default function Lesson() {
  return (
    <div className="flex justify-center p-6">
      <video
        controls
        preload="metadata"
        className="w-full max-w-full rounded-2xl shadow-lg hover:shadow-2xl transition duration-300"
      >
        <source src="/videos/video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
