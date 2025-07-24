import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [selectedQueryForResponse, setSelectedQueryForResponse] = useState(null)
  const [user, setUser] = useState(null)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    estimated_hours: ''
  })
  const [queryResponse, setQueryResponse] = useState('')
  
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
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
    })
    navigate('/', { replace: true })
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
      response: null
    }
  ]

  const formatTime = (seconds) => {
    if (!seconds) return "00:00:00"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
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

  const handleAssignTask = () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.estimated_hours) {
      return
    }

    // In real app, this would call an API
    console.log('Creating task:', newTask)
    
    setNewTask({
      title: '',
      description: '',
      estimated_hours: ''
    })
    setIsAssignTaskOpen(false)
  }

  const handleCancelAssignTask = () => {
    setNewTask({
      title: '',
      description: '',
      estimated_hours: ''
    })
    setIsAssignTaskOpen(false)
  }

  const handleQueryResponse = () => {
    if (!queryResponse.trim()) return

    // In real app, this would call an API
    console.log('Responding to query:', selectedQueryForResponse.id, queryResponse)
    
    setQueryResponse('')
    setSelectedQueryForResponse(null)
    setIsQueryResponseOpen(false)
  }

  const filteredTasks = allTasks.filter(task => {
    if (selectedEmployee !== 'all' && task.assigned_to !== parseInt(selectedEmployee)) return false
    if (selectedTaskFilter !== 'all' && task.status !== selectedTaskFilter) return false
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filteredQueries = queries.filter(query => {
    if (queryFilter !== 'all' && query.status !== queryFilter) return false
    if (selectedEmployee !== 'all' && query.employee_id !== parseInt(selectedEmployee)) return false
    return true
  })

  const totalEmployees = employees.length
  const activeEmployees = employees.filter(emp => emp.status === 'Working').length
  const completedEmployees = employees.filter(emp => emp.status === 'Complete').length
  const totalTasks = allTasks.length
  const completedTasks = allTasks.filter(task => task.status === 'Completed').length
  const openQueries = queries.filter(query => query.status === 'Open').length

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
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
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

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Now</p>
                  <p className="text-2xl font-bold text-green-600">{activeEmployees}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="w-6 h-6 text-green-600" />
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

          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Queries</p>
                  <p className="text-2xl font-bold text-orange-600">{openQueries}</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <MessageSquare className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Status Overview */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Employee Status Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {employees.map(employee => (
                <Card key={employee.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-blue-600 text-white text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                        <p className="text-xs text-gray-600">{employee.email}</p>
                      </div>
                      <Badge className={employee.status === 'Working' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} variant="outline">
                        {employee.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Hours Today</span>
                        <span className="font-semibold">{employee.totalHoursToday.toFixed(1)}/8.0</span>
                      </div>
                      <Progress value={employee.workProgress} className="h-2" />
                      
                      {employee.activeTask && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <span className="font-medium text-blue-900">Active: </span>
                          <span className="text-blue-700">{employee.activeTask}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>Completed: {employee.tasksCompleted}</span>
                        <span>In Progress: {employee.tasksInProgress}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="tasks" className="space-y-6">
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
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {queries.map(query => (
                <Card key={query.id} className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{query.subject}</h3>
                          <Badge className={
                            query.priority === 'High' ? 'bg-red-100 text-red-800' :
                            query.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          } variant="outline">
                            {query.priority}
                          </Badge>
                          <Badge className={
                            query.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                            query.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-orange-100 text-orange-800'
                          } variant="outline">
                            {query.status}
                          </Badge>
                        </div>
                        
                        <div className="mb-3">
                          <span className="font-medium text-gray-700">From: </span>
                          <span className="text-gray-600">{query.employee_name}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <span className="text-sm text-gray-500">{new Date(query.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{query.description}</p>
                        
                        {query.response && (
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <span className="font-medium text-blue-900">Your Response:</span>
                            <p className="text-blue-700 mt-1">{query.response}</p>
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
                        {query.status === 'Open' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // Mark query as resolved
                              console.log('Resolving query:', query.id)
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
      </div>
    </div>
  )
}

export default SuperiorDashboard