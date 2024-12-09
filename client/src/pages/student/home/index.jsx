import { courseCategories } from "@/config";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#00BFFF] via-[#FF8A65] to-[#FFB74D]">
      {/* Main Section with background video */}
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8 bg-transparent text-white shadow-lg">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4 text-shadow">Skills for the Now, Success for the Future</h1>
          <p className="text-xl">Acquire the skills you need for today and the future. Begin your learning journey with us!</p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0 relative overflow-hidden">
          <video
            autoPlay
            loop
            muted
            style={{
              width: "100%",
              height: "70vh",
              objectFit: "cover",
              opacity: "800",
            }}
          >
            <source src="../../../../public/homepage.mp4" type="video/mp4" />
          </video>
          {/* Modified color overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF] via-[#FF8A65] to-[#FFB74D] opacity-40"></div>
          {/* Adding a subtle shadow effect */}
          <div className="absolute inset-0 shadow-lg"></div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section className="py-8 px-4 lg:px-8 bg-gradient-to-r from-[#00BFFF] via-[#FF8A65] to-[#FFB74D] text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start text-white bg-[#FFB74D] hover:bg-[#FF9800] hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-12 px-4 lg:px-8 bg-gradient-to-r from-[#00BFFF] via-[#FF8A65] to-[#FFB74D] text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="border rounded-lg overflow-hidden shadow-xl cursor-pointer transition-all duration-300 transform hover:scale-105"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 bg-gradient-to-r from-[#FF8A65] to-[#FF7043]">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-200 mb-2">{courseItem?.instructorName}</p>
                  <p className="font-bold text-[16px]">${courseItem?.pricing}</p>
                </div>
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
