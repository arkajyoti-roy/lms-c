const CourseSkeleton = () => {
  return (
    <div>
      <div className="flex flex-wrap -m-2 gap-5 justify-around">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="lg:w-[calc(23%-20px)] md:w-[calc(48%-20px)] p-2 w-full border rounded-lg animate-pulse"
          >
            <div className="block relative h-48 rounded overflow-hidden bg-gray-300"></div>
            <div className="mt-4">
              <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSkeleton;
