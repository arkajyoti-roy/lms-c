import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Eye,
  Star,
  Calendar,
  BarChart3,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Award,
  Target,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Mock data - replace with actual API calls
  const [dashboardData, setDashboardData] = useState({
    totalCourses: 12,
    totalStudents: 1247,
    totalRevenue: 89340,
    monthlyRevenue: 12450,
    avgRating: 4.7,
    totalReviews: 234,
    publishedCourses: 8,
    draftCourses: 4,
    completionRate: 87
  });

  const [revenueData] = useState([
    { month: 'Jan', revenue: 8500, students: 45 },
    { month: 'Feb', revenue: 9200, students: 52 },
    { month: 'Mar', revenue: 7800, students: 38 },
    { month: 'Apr', revenue: 10500, students: 63 },
    { month: 'May', revenue: 11200, students: 71 },
    { month: 'Jun', revenue: 12450, students: 78 }
  ]);

  const [coursePerformance] = useState([
    { name: 'React Masterclass', students: 234, revenue: 23400, rating: 4.8 },
    { name: 'Node.js Complete', students: 189, revenue: 18900, rating: 4.6 },
    { name: 'Full Stack Dev', students: 156, revenue: 15600, rating: 4.9 },
    { name: 'JavaScript Basics', students: 298, revenue: 14900, rating: 4.5 },
    { name: 'CSS Advanced', students: 167, revenue: 8350, rating: 4.7 }
  ]);

  const [categoryData] = useState([
    { name: 'Web Development', value: 45, color: '#3b82f6' },
    { name: 'JavaScript', value: 25, color: '#10b981' },
    { name: 'React', value: 20, color: '#f59e0b' },
    { name: 'Node.js', value: 10, color: '#ef4444' }
  ]);

  const [recentActivities] = useState([
    { type: 'enrollment', message: 'New student enrolled in React Masterclass', time: '2 hours ago' },
    { type: 'review', message: 'New 5-star review for Full Stack Dev course', time: '4 hours ago' },
    { type: 'completion', message: '15 students completed JavaScript Basics', time: '6 hours ago' },
    { type: 'revenue', message: 'Monthly revenue target achieved', time: '1 day ago' }
  ]);

  const StatCard = ({ title, value, description, icon: Icon, trend, trendValue, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600", 
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
      red: "from-red-500 to-red-600"
    };

    return (
      <Card className="relative overflow-hidden border-0 shadow-lg">
        <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-5`} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
            {trend && (
              <div className={`flex items-center ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                <span>{trendValue}</span>
              </div>
            )}
            <span>{description}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Instructor Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your courses.</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="hover:bg-blue-50">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Courses"
            value={dashboardData.totalCourses}
            description="8 published, 4 drafts"
            icon={BookOpen}
            trend="up"
            trendValue="+2 this month"
            color="blue"
          />
          <StatCard
            title="Total Revenue"
            value={`₹${dashboardData.totalRevenue.toLocaleString()}`}
            description="All time earnings"
            icon={DollarSign}
            trend="up"
            trendValue="+15.3%"
            color="green"
          />
          <StatCard
            title="Total Students"
            value={dashboardData.totalStudents}
            description="Across all courses"
            icon={Users}
            trend="up"
            trendValue="+78 this month"
            color="purple"
          />
          <StatCard
            title="Average Rating"
            value={dashboardData.avgRating}
            description={`From ${dashboardData.totalReviews} reviews`}
            icon={Star}
            trend="up"
            trendValue="+0.2"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Revenue Chart */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                Revenue Trend
              </CardTitle>
              <CardDescription>Monthly revenue and student enrollments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Course Categories */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Course Categories
              </CardTitle>
              <CardDescription>Distribution of your courses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {categoryData.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Performance & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Top Performing Courses */}
          <Card className="lg:col-span-2 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Award className="h-5 w-5 mr-2 text-yellow-600" />
                Top Performing Courses
              </CardTitle>
              <CardDescription>Your most successful courses by revenue and students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {coursePerformance.map((course, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:from-blue-50 hover:to-indigo-50 transition-all">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{course.name}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {course.students} students
                        </div>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-1 text-yellow-500" />
                          {course.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">₹{course.revenue.toLocaleString()}</div>
                      <Badge variant="secondary" className="mt-1">
                        #{index + 1}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'enrollment' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'review' ? 'bg-yellow-100 text-yellow-600' :
                      activity.type === 'completion' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'enrollment' && <Users className="h-4 w-4" />}
                      {activity.type === 'review' && <Star className="h-4 w-4" />}
                      {activity.type === 'completion' && <Award className="h-4 w-4" />}
                      {activity.type === 'revenue' && <DollarSign className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-gray-800">Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200">
                <Plus className="h-6 w-6 text-blue-600" />
                <span>New Course</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-green-50 hover:border-green-200">
                <BarChart3 className="h-6 w-6 text-green-600" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200">
                <Users className="h-6 w-6 text-purple-600" />
                <span>Student Messages</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-orange-50 hover:border-orange-200">
                <Star className="h-6 w-6 text-orange-600" />
                <span>Reviews</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;