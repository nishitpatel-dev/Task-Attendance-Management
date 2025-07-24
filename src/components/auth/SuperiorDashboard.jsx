import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Timer, 
  Users,
  User,
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  FileText,
  Eye,
  Edit,
  Filter,
  Search,
  UserCheck,
  ClipboardList,
  BarChart3,
  Send,
  Download,
  LogOut
} from 'lucide-react'

const SuperiorDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState('all')
  const [selectedTaskFilter, setSelectedTaskFilter] = useState('all')
  const [queryFilter, setQueryFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false)
  const [isQueryResponseOpen, setIsQueryResponseOpen] = useState(false)
  const [isAllTasksModalOpen, setIsAllTasksModalOpen] = useState(false)
  const [selectedQueryForResponse, setSelectedQueryForResponse] = useState(null)
  const [user, setUser] = useState(null)
  const [allTasksFromAPI, setAllTasksFromAPI] = useState([])
  const [isLoadingAllTasks, setIsLoadingAllTasks] = useState(false)
  const [allQueriesFromAPI, setAllQueriesFromAPI] = useState([])
  const [isLoadingQueries, setIsLoadingQueries] = useState(false)
  const [allEmployeesFromAPI, setAllEmployeesFromAPI] = useState([])
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    estimated_hours: ''
  })
  const [queryResponse, setQueryResponse] = useState('')
  const [activeTab, setActiveTab] = useState('tasks')
  
  const navigate = useNavigate()
  const { toast } = useToast()

  // Timer effect for current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Check authentication and get user data
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (!token || !userData) {
      navigate('/', { replace: true })
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'superior') {
      navigate('/employee', { replace: true })
      return
    }
    
    setUser(parsedUser)
    
    // Fetch initial task count and queries
    fetchAllTasks()
    fetchAllQueries()
    fetchAllEmployees()
  }, [navigate])

  const fetchAllQueries = async () => {
    try {
      setIsLoadingQueries(true)
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again to view queries",
          variant: "destructive"
        })
        return
      }

      const response = await axios.get('http://localhost:5014/api/Queries', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Fetched queries from API:', response.data) // Debug log
      setAllQueriesFromAPI(response.data)
    } catch (error) {
      console.error('Error fetching queries:', error)
      toast({
        title: "Error fetching queries",
        description: "Failed to load queries from server",
        variant: "destructive"
      })
    } finally {
      setIsLoadingQueries(false)
    }
  }

  const fetchAllEmployees = async () => {
    try {
      setIsLoadingEmployees(true)
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again to view employees",
          variant: "destructive"
        })
        return
      }

      const response = await axios.get('http://localhost:5014/api/Users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Fetched employees from API:', response.data) // Debug log
      // Filter out superiors (roleId 1) and only show employees (roleId 2)
      const employees = response.data.filter(user => user.roleId === 2)
      setAllEmployeesFromAPI(employees)
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast({
        title: "Error fetching employees",
        description: "Failed to load employees from server",
        variant: "destructive"
      })
    } finally {
      setIsLoadingEmployees(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    navigate('/', { replace: true })
  }

  const fetchAllTasks = async () => {
    try {
      setIsLoadingAllTasks(true)
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again to view tasks",
          variant: "destructive"
        })
        return
      }

      const response = await axios.get('http://localhost:5014/api/Task', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setAllTasksFromAPI(response.data)
    } catch (error) {
      console.error('Error fetching all tasks:', error)
      toast({
        title: "Error fetching tasks",
        description: "Failed to load tasks from server",
        variant: "destructive"
      })
    } finally {
      setIsLoadingAllTasks(false)
    }
  }

  const handleAllTasksClick = () => {
    setIsAllTasksModalOpen(true)
    fetchAllTasks()
  }

  const handleOpenQueriesClick = () => {
    setActiveTab('queries')
  }

  // Show loading if user data is not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Mock data for employees
  const employees = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      totalHoursToday: 6.5,
      workProgress: 81.25,
      activeTask: "Implement User Authentication",
      status: "Working",
      tasksCompleted: 2,
      tasksInProgress: 1
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      totalHoursToday: 8.0,
      workProgress: 100,
      activeTask: null,
      status: "Complete",
      tasksCompleted: 3,
      tasksInProgress: 0
    },
    {
      id: 3,
      name: "Mike Wilson",
      email: "mike.wilson@company.com",
      totalHoursToday: 4.2,
      workProgress: 52.5,
      activeTask: "Frontend Component Development",
      status: "Working",
      tasksCompleted: 1,
      tasksInProgress: 2
    }
  ]

  // Mock data for tasks
  const allTasks = [
    {
      task_id: 1,
      title: "Implement User Authentication",
      description: "Create login/logout functionality with JWT tokens",
      estimated_hours: 4.0,
      assigned_to: 1,
      assigned_to_name: "John Doe",
      created_at: "2025-01-15T09:00:00Z",
      status: "In Progress",
      time_spent: 3.2
    },
    {
      task_id: 2,
      title: "Design Database Schema",
      description: "Create ERD and database tables for the application",
      estimated_hours: 3.0,
      assigned_to: 2,
      assigned_to_name: "Sarah Johnson",
      created_at: "2025-01-14T14:30:00Z",
      status: "Completed",
      time_spent: 3.5
    },
    {
      task_id: 3,
      title: "Frontend Component Development",
      description: "Build reusable React components for the dashboard",
      estimated_hours: 6.0,
      assigned_to: 3,
      assigned_to_name: "Mike Wilson",
      created_at: "2025-01-13T11:15:00Z",
      status: "In Progress",
      time_spent: 2.8
    },
    {
      task_id: 4,
      title: "API Integration",
      description: "Integrate frontend with backend APIs",
      estimated_hours: 5.0,
      assigned_to: 1,
      assigned_to_name: "John Doe",
      created_at: "2025-01-12T10:00:00Z",
      status: "Completed",
      time_spent: 4.8
    }
  ]

  // Mock data for queries
  const queries = [
    {
      id: 1,
      task_id: 1,
      task_title: "Implement User Authentication",
      employee_id: 1,
      employee_name: "John Doe",
      subject: "Clarification on JWT implementation",
      description: "I need clarification on which JWT library to use and the token expiration strategy.",
      status: "Open",
      created_at: "2025-01-15T14:30:00Z",
      response: null
    },
    {
      id: 2,
      task_id: 2,
      task_title: "Design Database Schema",
      employee_id: 2,
      employee_name: "Sarah Johnson",
      subject: "Database relationships question",
      description: "Should we use foreign key constraints for all relationships or handle them at application level?",
      status: "Resolved",
      created_at: "2025-01-14T16:20:00Z",
      response: "Use foreign key constraints for data integrity. Application level checks are additional security."
    },
    {
      id: 3,
      task_id: 3,
      task_title: "Frontend Component Development",
      employee_id: 3,
      employee_name: "Mike Wilson",
      subject: "Component library selection",
      description: "Which UI component library should we use - Material-UI or Tailwind with shadcn/ui?",
      status: "In Progress",
      created_at: "2025-01-13T11:45:00Z",
    }
  ]

  const formatTime = (seconds) => {
    if (!seconds) return "00:00:00"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Helper function to format relative time
  const formatRelativeTime = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
    } else if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Pending': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getQueryStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800 border-red-200'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleAssignTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.estimated_hours) {
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again to create tasks",
          variant: "destructive"
        })
        return
      }

      // Prepare task object according to API structure
      const taskPayload = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        estimatedHours: parseFloat(newTask.estimated_hours),
        assignedBy: 1 // Superior assigns tasks with assignedBy: 1
      }

      // Call POST API
      const response = await axios.post('http://localhost:5014/api/Task', taskPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Reset form
      setNewTask({
        title: '',
        description: '',
        estimated_hours: ''
      })
      setIsAssignTaskOpen(false)
      
      // Show success toast
      toast({
        title: "Task created successfully",
        description: `Task "${taskPayload.title}" has been created successfully`,
      })

      // Refresh the all tasks data to update the count in the overview card
      fetchAllTasks()
      
      // Also refresh queries in case there are any related to the new task
      fetchAllQueries()

    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: "Error creating task",
        description: "Failed to create task on server. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleCancelAssignTask = () => {
    setNewTask({
      title: '',
      description: '',
      estimated_hours: ''
    })
    setIsAssignTaskOpen(false)
  }

  const handleQueryResponse = async () => {
    if (!queryResponse.trim()) return

    try {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('userData')
      
      if (!token || !userData) {
        toast({
          title: "Authentication Error",
          description: "Please login again to send response",
          variant: "destructive"
        })
        return
      }

      const user = JSON.parse(userData)
      
      // Prepare the response payload according to API structure
      const responsePayload = {
        queryId: selectedQueryForResponse.queryId,
        repliedBy: user.userId,
        message: queryResponse.trim()
      }

      // Call POST API to submit the response
      const response = await axios.post('http://localhost:5014/api/QueryReplies/reply', responsePayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Show success toast
      toast({
        title: "Response sent successfully",
        description: `Your response to "${selectedQueryForResponse.subject}" has been sent`,
      })
      
      // Reset form and close modal
      setQueryResponse('')
      setSelectedQueryForResponse(null)
      setIsQueryResponseOpen(false)
      
      // Refresh queries to get updated data
      fetchAllQueries()

    } catch (error) {
      console.error('Error sending query response:', error)
      toast({
        title: "Error sending response",
        description: "Failed to send response. Please try again.",
        variant: "destructive"
      })
    }
  }

  const filteredTasks = allTasks.filter(task => {
    if (selectedEmployee !== 'all' && task.assigned_to !== parseInt(selectedEmployee)) return false
    if (selectedTaskFilter !== 'all' && task.status !== selectedTaskFilter) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filteredQueries = allQueriesFromAPI.filter(query => {
    if (queryFilter !== 'all' && query.status !== queryFilter) return false
    return true
  })

  const totalEmployees = allEmployeesFromAPI.length
  const activeEmployees = employees.filter(emp => emp.status === 'Working').length
  const completedEmployees = employees.filter(emp => emp.status === 'Complete').length
  const totalTasks = allTasks.length
  const completedTasks = allTasks.filter(task => task.status === 'Completed').length
  const totalQueries = allQueriesFromAPI.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-600 text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome, {user?.name || 'Superior'}!
              </h1>
              <p className="text-gray-600">{currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-gray-900">
                {currentTime.toLocaleTimeString()}
              </div>
              <p className="text-sm text-gray-600">Current Time</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="shadow-lg border-0 bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-900">{totalEmployees}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-lg border-0 bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow"
            onClick={handleAllTasksClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">All Tasks</p>
                  <p className="text-2xl font-bold text-green-600">{allTasksFromAPI.length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{completedTasks}/{totalTasks}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-lg border-0 bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-xl transition-shadow"
            onClick={handleOpenQueriesClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">All Queries</p>
                  <p className="text-2xl font-bold text-orange-600">{totalQueries}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Overview */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Employee Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingEmployees ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading employees...</span>
              </div>
            ) : allEmployeesFromAPI.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employees Found</h3>
                <p className="text-gray-600">No employees have been registered yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {allEmployeesFromAPI.map(employee => (
                  <Card key={employee.userId} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-blue-600 text-white text-sm">
                            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                          <p className="text-xs text-gray-600">{employee.email}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800" variant="outline">
                          Active
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-gray-700">Joined:</span>
                          <p className="text-gray-600">
                            {new Date(employee.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <ClipboardList className="w-4 h-4" />
              <span>Task Management</span>
            </TabsTrigger>
            <TabsTrigger value="queries" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Employee Queries</span>
            </TabsTrigger>
          </TabsList>

          {/* Task Management Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Task Management</h2>
              <Button 
                onClick={() => setIsAssignTaskOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Button>
            </div>

            <div className="grid gap-4">
              {filteredTasks.map(task => (
                <Card key={task.task_id} className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                          <Badge className={
                            task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          } variant="outline">
                            {task.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Assigned to:</span>
                            <p className="text-gray-600">{task.assigned_to_name}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Created:</span>
                            <p className="text-gray-600">{new Date(task.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Estimated Hours:</span>
                            <p className="text-gray-600">{task.estimated_hours}h</p>
                          </div>
                        </div>
                        
                        {task.time_spent > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{task.time_spent.toFixed(1)}h / {task.estimated_hours}h</span>
                            </div>
                            <Progress value={(task.time_spent / task.estimated_hours) * 100} className="h-2" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Queries Tab */}
          <TabsContent value="queries" className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Employee Queries</h2>
              <div className="flex space-x-2">
                <Select value={queryFilter} onValueChange={setQueryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Queries</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {isLoadingQueries ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading queries...</span>
                </div>
              ) : allQueriesFromAPI.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Queries Found</h3>
                  <p className="text-gray-600 mb-4">No employee queries have been submitted yet.</p>
                </div>
              ) : filteredQueries.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Queries Found</h3>
                  <p className="text-gray-600 mb-4">No queries match the selected filter.</p>
                </div>
              ) : (
                filteredQueries.map(query => (
                  <Card key={query.queryId} className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{query.subject}</h3>
                            <Badge variant={query.status === 'Open' ? "destructive" : query.status === 'Resolved' ? "default" : "outline"}>
                              {query.status}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{query.description}</p>
                          
                          <div className="mb-3">
                            <span className="text-sm text-gray-500">{formatRelativeTime(query.raisedAt)}</span>
                          </div>
                          
                          {query.queryReplies && query.queryReplies.length > 0 && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <span className="font-medium text-blue-900">Latest Response:</span>
                              <p className="text-blue-700 mt-1">{query.queryReplies[query.queryReplies.length - 1].replyText}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedQueryForResponse(query)
                              setIsQueryResponseOpen(true)
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Task Modal */}
        <Dialog open={isAssignTaskOpen} onOpenChange={setIsAssignTaskOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="estimatedHours">Estimated Hours</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  step="0.5"
                  value={newTask.estimated_hours}
                  onChange={(e) => setNewTask({...newTask, estimated_hours: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancelAssignTask}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAssignTask}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Task
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Query Response Modal */}
        <Dialog open={isQueryResponseOpen} onOpenChange={setIsQueryResponseOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Respond to Query</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {selectedQueryForResponse && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-gray-900">{selectedQueryForResponse.subject}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedQueryForResponse.description}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    <span>{formatRelativeTime(selectedQueryForResponse.raisedAt)}</span>
                  </div>
                </div>
              )}
              
              <div>
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={queryResponse}
                  onChange={(e) => setQueryResponse(e.target.value)}
                  placeholder="Type your response here..."
                  rows={4}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsQueryResponseOpen(false)
                    setSelectedQueryForResponse(null)
                    setQueryResponse('')
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleQueryResponse}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Send Response
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* All Tasks Modal */}
        <Dialog open={isAllTasksModalOpen} onOpenChange={setIsAllTasksModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                <span>All Tasks</span>
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[60vh]">
              {isLoadingAllTasks ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-3 text-gray-600">Loading tasks...</span>
                </div>
              ) : allTasksFromAPI.length === 0 ? (
                <div className="text-center py-8">
                  <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
                  <p className="text-gray-600">No tasks have been created yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allTasksFromAPI.map(task => (
                    <Card key={task.taskId} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                            <p className="text-gray-600 mt-1">{task.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Estimated Hours:</span>
                              <span className="text-gray-600 ml-2">{task.estimatedHours}h</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Created At:</span>
                              <span className="text-gray-600 ml-2">
                                {new Date(task.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsAllTasksModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default SuperiorDashboard