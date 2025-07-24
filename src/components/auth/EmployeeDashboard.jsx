import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Timer, 
  Coffee,
  User,
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  FileText
} from 'lucide-react'

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [todayHours, setTodayHours] = useState(0)
  const [taskTimers, setTaskTimers] = useState({})
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    estimated_hours: '',
    assigned_by: ''
  })

  const [tasks, setTasks] = useState([
    {
      task_id: 1,
      title: "Implement User Authentication",
      description: "Create login/logout functionality with JWT tokens",
      estimated_hours: 4.0,
      assigned_by: 101,
      is_public: true,
      created_at: "2025-01-15T09:00:00Z"
    },
    {
      task_id: 2,
      title: "Design Database Schema",
      description: "Create ERD and database tables for the application",
      estimated_hours: 3.0,
      assigned_by: 102,
      is_public: false,
      created_at: "2025-01-14T14:30:00Z"
    },
    {
      task_id: 3,
      title: "Frontend Component Development",
      description: "Build reusable React components for the dashboard",
      estimated_hours: 6.0,
      assigned_by: 103,
      is_public: true,
      created_at: "2025-01-13T11:15:00Z"
    }
  ])

  const mockQueries = [
    {
      id: 1,
      taskTitle: "Implement User Authentication",
      subject: "Clarification on JWT implementation",
      status: "Open",
      createdAt: "2 hours ago"
    },
    {
      id: 2,
      taskTitle: "Design Database Schema",
      subject: "Database relationships question",
      status: "Resolved",
      createdAt: "1 day ago"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      if (activeTaskId && !isPaused) {
        setTaskTimers(prev => ({
          ...prev,
          [activeTaskId]: (prev[activeTaskId] || 0) + 1
        }))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [activeTaskId, isPaused])

  const formatTime = (seconds) => {
    if (!seconds) return "00:00:00"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTask = (taskId) => {
    if (activeTaskId && activeTaskId !== taskId) {
      stopCurrentTask()
    }
    setActiveTaskId(taskId)
    setIsPaused(false)
  }

  const pauseTimer = () => {
    setIsPaused(true)
  }

  const resumeTimer = () => {
    setIsPaused(false)
  }

  const stopCurrentTask = () => {
    setActiveTaskId(null)
    setIsPaused(false)
  }

  const stopTask = (taskId) => {
    if (activeTaskId === taskId) {
      setActiveTaskId(null)
      setIsPaused(false)
    }
  }

  const getTotalTimeSpent = () => {
    return Object.values(taskTimers).reduce((total, time) => total + time, 0)
  }

  const handleAddTask = () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.estimated_hours) {
      return
    }

    const taskToAdd = {
      task_id: Math.max(...tasks.map(t => t.task_id), 0) + 1,
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      estimated_hours: parseFloat(newTask.estimated_hours),
      assigned_by: "",
      is_public: false,
      created_at: new Date().toISOString()
    }

    setTasks(prev => [...prev, taskToAdd])
    setNewTask({
      title: '',
      description: '',
      estimated_hours: '',
      assigned_by: ''
    })
    setIsAddTaskOpen(false)
  }

  const handleCancelAddTask = () => {
    setNewTask({
      title: '',
      description: '',
      estimated_hours: '',
      assigned_by: ''
    })
    setIsAddTaskOpen(false)
  }

  const totalHoursToday = getTotalTimeSpent() / 3600
  const workProgress = Math.min((totalHoursToday / 8) * 100, 100)
  const activeTask = tasks.find(task => task.task_id === activeTaskId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-600 text-white">
                <User className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, Employee!</h1>
              <p className="text-gray-600">{currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-gray-900">
              {currentTime.toLocaleTimeString()}
            </div>
            <p className="text-sm text-gray-600">Current Time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <Card className="lg:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Timer className="w-5 h-5 text-blue-600" />
                <span>Active Task Timer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeTask ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900">{activeTask.title}</h3>
                    <p className="text-blue-700 text-sm mt-1">{activeTask.description}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-gray-900 mb-4">
                      {formatTime(taskTimers[activeTaskId] || 0)}
                    </div>
                    
                    <div className="flex justify-center space-x-3">
                      {!isPaused ? (
                        <Button onClick={pauseTimer} variant="outline" size="sm">
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button onClick={resumeTimer} className="bg-green-600 hover:bg-green-700" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      
                      <Button onClick={() => stopTask(activeTaskId)} variant="outline" size="sm">
                        <Square className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                      
                      <Button variant="outline" size="sm">
                        <Coffee className="w-4 h-4 mr-2" />
                        Break
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Task</h3>
                  <p className="text-gray-600 mb-4">Select a task from below to start tracking time</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Today's Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Hours Worked</span>
                    <span className="font-semibold">{totalHoursToday.toFixed(1)}/8.0</span>
                  </div>
                  <Progress value={workProgress} className="h-2" />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{tasks.length}</div>
                    <div className="text-xs text-gray-600">Total Tasks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{Object.keys(taskTimers).length}</div>
                    <div className="text-xs text-gray-600">Started Tasks</div>
                  </div>
                </div>

                {workProgress >= 100 && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Great job! You've completed your 8-hour work day.
                    </AlertDescription>
                  </Alert>
                )}
                
                {workProgress < 100 && workProgress > 0 && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      {(8 - totalHoursToday).toFixed(1)} hours remaining to complete your work day.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Quick Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Timer</span>
                  <Badge variant={activeTaskId ? "default" : "secondary"}>
                    {activeTaskId ? "Running" : "Stopped"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Break Status</span>
                  <Badge variant={isPaused ? "outline" : "secondary"}>
                    {isPaused ? "On Break" : "Working"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Day Status</span>
                  <Badge variant={workProgress >= 100 ? "default" : "outline"}>
                    {workProgress >= 100 ? "Complete" : "In Progress"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="tasks" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>My Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="queries" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Queries</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Tasks</h2>
              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-gray-900">Add New Task</DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Create a new task with the required information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                        Task Title *
                      </Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask(prev => ({...prev, title: e.target.value}))}
                        placeholder="Enter task title"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Description *
                      </Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) => setNewTask(prev => ({...prev, description: e.target.value}))}
                        placeholder="Enter task description"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estimated_hours" className="text-sm font-medium text-gray-700">
                        Estimated Hours *
                      </Label>
                      <Input
                        id="estimated_hours"
                        type="number"
                        step="0.5"
                        min="0.5"
                        value={newTask.estimated_hours}
                        onChange={(e) => setNewTask(prev => ({...prev, estimated_hours: e.target.value}))}
                        placeholder="e.g., 4.5"
                        className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleCancelAddTask}
                      className="hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddTask}
                      className="bg-blue-600 hover:bg-blue-700"
                      disabled={!newTask.title.trim() || !newTask.description.trim() || !newTask.estimated_hours}
                    >
                      Add Task
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tasks.map(task => (
                <Card key={task.task_id} className="shadow-md border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                    </div>
                    <CardDescription>{task.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">Time Spent:</span>
                      </div>
                      <div className="font-mono font-bold text-lg text-blue-600">
                        {formatTime(taskTimers[task.task_id] || 0)}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Estimated: {task.estimated_hours}h</span>
                      <span className="text-gray-600">Created: {new Date(task.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      {activeTaskId === task.task_id ? (
                        <div className="flex space-x-2 flex-1">
                          {!isPaused ? (
                            <Button 
                              onClick={pauseTimer} 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                          ) : (
                            <Button 
                              onClick={resumeTimer} 
                              size="sm" 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </Button>
                          )}
                          <Button 
                            onClick={() => stopTask(task.task_id)} 
                            variant="outline" 
                            size="sm"
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => startTask(task.task_id)} 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Timer
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Query
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="queries" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Queries</h2>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Raise Query
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockQueries.map(query => (
                <Card key={query.id} className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{query.subject}</h3>
                        <p className="text-sm text-gray-600">Task: {query.taskTitle}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={query.status === 'Open' ? "destructive" : "default"}>
                          {query.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{query.createdAt}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Attendance Reports</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Work Time</span>
                    <span className="font-semibold">{totalHoursToday.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Break Time</span>
                    <span className="font-semibold">0.5 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasks Started</span>
                    <span className="font-semibold">{Object.keys(taskTimers).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <Badge variant={workProgress >= 100 ? "default" : "outline"}>
                      {workProgress >= 100 ? "Complete" : "In Progress"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Task-wise Time Tracking</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasks.map(task => (
                    <div key={task.task_id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="text-sm font-medium">{task.title}</span>
                        <div className="text-xs text-gray-500">Est: {task.estimated_hours}h</div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold font-mono text-blue-600">
                          {formatTime(taskTimers[task.task_id] || 0)}
                        </span>
                        <div className="text-xs text-gray-500">
                          {((taskTimers[task.task_id] || 0) / 3600).toFixed(1)}h
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(taskTimers).length === 0 && (
                    <p className="text-gray-500 text-center py-4">No time tracked yet today</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default EmployeeDashboard