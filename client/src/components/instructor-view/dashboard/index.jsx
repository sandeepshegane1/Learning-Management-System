import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users } from "lucide-react";

function InstructorDashboard({ listOfCourses }) {
  const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
    (acc, course) => {
      const studentCount = course.students.length;
      acc.totalStudents += studentCount;
      acc.totalProfit += course.pricing * studentCount;
      course.students.forEach((student) => {
        acc.studentList.push({
          courseTitle: course.title,
          studentName: student.studentName,
          studentEmail: student.studentEmail,
        });
      });
      return acc;
    },
    {
      totalStudents: 0,
      totalProfit: 0,
      studentList: [],
    }
  );

  const config = [
    {
      icon: Users,
      label: "Total Students",
      value: totalStudents,
      bgColor: "bg-gradient-to-br from-indigo-500/30 to-indigo-600/30",
      iconColor: "text-indigo-300",
      valueColor: "text-white",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: totalProfit,
      bgColor: "bg-gradient-to-br from-pink-500/30 to-pink-600/30",
      iconColor: "text-pink-300",
      valueColor: "text-white",
    },
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,rgba(255,255,255,0.1),transparent)]" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      {/* Main content */}
      <div className="relative w-full p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.map((item, index) => (
            <Card 
              key={index} 
              className={`${item.bgColor} border-0 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-200">
                  {item.label}
                </CardTitle>
                <item.icon className={`h-4 w-4 ${item.iconColor}`} />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${item.valueColor}`}>
                  {item.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-0 bg-white/10 backdrop-blur-sm shadow-xl">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-gray-100">Students List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="hover:bg-white/5">
                    <TableHead className="text-gray-200 font-semibold">
                      Course Name
                    </TableHead>
                    <TableHead className="text-gray-200 font-semibold">
                      Student Name
                    </TableHead>
                    <TableHead className="text-gray-200 font-semibold">
                      Student Email
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentList.map((studentItem, index) => (
                    <TableRow 
                      key={index}
                      className="hover:bg-white/5 transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-gray-200">
                        {studentItem.courseTitle}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {studentItem.studentName}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {studentItem.studentEmail}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default InstructorDashboard;