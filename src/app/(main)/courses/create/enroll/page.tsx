import CreateCourseForm from "./CreateCourseForm";

export default function EnrollStudentPage() {
  return (
    <div className="space-y-8 sm:space-y-20">
      <h1 className="text-start sm:text-center font-bold text-2xl sm:text-4xl">
        Enroll Studens
      </h1>
      <CreateCourseForm />
    </div>
  );
}
