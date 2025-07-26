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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
  Coffee,
  User,
  Calendar,
  Target,
  TrendingUp,
  MessageSquare,
  FileText,
  LogOut
} from 'lucide-react'

const EmployeeDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTaskId, setActiveTaskId] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [todayHours, setTodayHours] = useState(0)
  const [taskTimers, setTaskTimers] = useState({})
  const [isOnManualBreak, setIsOnManualBreak] = useState(false)
  const [manualBreakStartTime, setManualBreakStartTime] = useState(null)
  const [totalBreakTime, setTotalBreakTime] = useState(0)
  const [isBreakPaused, setIsBreakPaused] = useState(false)
  const [breakPauseStartTime, setBreakPauseStartTime] = useState(null)
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [startedTasks, setStartedTasks] = useState(new Set())
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    estimated_hours: '',
    assigned_by: ''
  })
  const [tasks, setTasks] = useState([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [queries, setQueries] = useState([])
  const [isLoadingQueries, setIsLoadingQueries] = useState(true)
  const [allQueryRepliesFromAPI, setAllQueryRepliesFromAPI] = useState([])
  const [isLoadingQueryReplies, setIsLoadingQueryReplies] = useState(false)
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false)
  const [selectedTaskForQuery, setSelectedTaskForQuery] = useState(null)
  const [queryForm, setQueryForm] = useState({
    subject: '',
    description: ''
  })

  const navigate = useNavigate()
  const { toast } = useToast()

  const getUserTimerKey = (userId) => `taskTimers_${userId}`
  const getUserActiveTaskKey = (userId) => `activeTaskId_${userId}`
  const getUserPausedKey = (userId) => `isPaused_${userId}`
  const getUserLastActiveDateKey = (userId) => `lastActiveDate_${userId}`
  const getUserManualBreakKey = (userId) => `isOnManualBreak_${userId}`
  const getUserManualBreakStartTimeKey = (userId) => `manualBreakStartTime_${userId}`
  const getUserTotalBreakTimeKey = (userId) => `totalBreakTime_${userId}`
  const getUserBreakPausedKey = (userId) => `isBreakPaused_${userId}`
  const getUserBreakPauseStartTimeKey = (userId) => `breakPauseStartTime_${userId}`
  const getUserStartedTasksKey = (userId) => `startedTasks_${userId}`

  const loadUserTimerData = (userId) => {
    const savedTimers = localStorage.getItem(getUserTimerKey(userId))
    const savedActiveTaskId = localStorage.getItem(getUserActiveTaskKey(userId))
    const savedIsPaused = localStorage.getItem(getUserPausedKey(userId))
    const savedIsOnManualBreak = localStorage.getItem(getUserManualBreakKey(userId))
    const savedManualBreakStartTime = localStorage.getItem(getUserManualBreakStartTimeKey(userId))
    const savedTotalBreakTime = localStorage.getItem(getUserTotalBreakTimeKey(userId))
    const savedIsBreakPaused = localStorage.getItem(getUserBreakPausedKey(userId))
    const savedBreakPauseStartTime = localStorage.getItem(getUserBreakPauseStartTimeKey(userId))
    const savedStartedTasks = localStorage.getItem(getUserStartedTasksKey(userId))
    
    return {
      timers: savedTimers ? JSON.parse(savedTimers) : {},
      activeTaskId: savedActiveTaskId ? parseInt(savedActiveTaskId) : null,
      isPaused: savedIsPaused === 'true',
      isOnManualBreak: savedIsOnManualBreak === 'true',
      manualBreakStartTime: savedManualBreakStartTime ? parseInt(savedManualBreakStartTime) : null,
      totalBreakTime: savedTotalBreakTime ? parseInt(savedTotalBreakTime) : 0,
      isBreakPaused: savedIsBreakPaused === 'true',
      breakPauseStartTime: savedBreakPauseStartTime ? parseInt(savedBreakPauseStartTime) : null,
      startedTasks: savedStartedTasks ? new Set(JSON.parse(savedStartedTasks)) : new Set()
    }
  }

  const saveUserTimerData = (userId, timers, activeTaskId, isPaused, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime, startedTasks) => {
    localStorage.setItem(getUserTimerKey(userId), JSON.stringify(timers))
    
    if (activeTaskId !== null) {
      localStorage.setItem(getUserActiveTaskKey(userId), activeTaskId.toString())
    } else {
      localStorage.removeItem(getUserActiveTaskKey(userId))
    }
    
    localStorage.setItem(getUserPausedKey(userId), isPaused.toString())
    localStorage.setItem(getUserManualBreakKey(userId), isOnManualBreak.toString())
    localStorage.setItem(getUserTotalBreakTimeKey(userId), totalBreakTime.toString())
    localStorage.setItem(getUserBreakPausedKey(userId), isBreakPaused.toString())
    
    if (manualBreakStartTime !== null) {
      localStorage.setItem(getUserManualBreakStartTimeKey(userId), manualBreakStartTime.toString())
    } else {
      localStorage.removeItem(getUserManualBreakStartTimeKey(userId))
    }
    
    if (breakPauseStartTime !== null) {
      localStorage.setItem(getUserBreakPauseStartTimeKey(userId), breakPauseStartTime.toString())
    } else {
      localStorage.removeItem(getUserBreakPauseStartTimeKey(userId))
    }
    
    if (startedTasks && startedTasks.size > 0) {
      localStorage.setItem(getUserStartedTasksKey(userId), JSON.stringify([...startedTasks]))
    } else {
      localStorage.removeItem(getUserStartedTasksKey(userId))
    }
  }

  const clearUserTimerData = (userId) => {
    localStorage.removeItem(getUserTimerKey(userId))
    localStorage.removeItem(getUserActiveTaskKey(userId))
    localStorage.removeItem(getUserPausedKey(userId))
    localStorage.removeItem(getUserLastActiveDateKey(userId))
    localStorage.removeItem(getUserManualBreakKey(userId))
    localStorage.removeItem(getUserManualBreakStartTimeKey(userId))
    localStorage.removeItem(getUserTotalBreakTimeKey(userId))
    localStorage.removeItem(getUserBreakPausedKey(userId))
    localStorage.removeItem(getUserBreakPauseStartTimeKey(userId))
    localStorage.removeItem(getUserStartedTasksKey(userId))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      if (activeTaskId && !isPaused && user && !isOnManualBreak) {
        setTaskTimers(prev => {
          const newTimers = {
            ...prev,
            [activeTaskId]: (prev[activeTaskId] || 0) + 1
          }
          saveUserTimerData(user.id, newTimers, activeTaskId, isPaused, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime, startedTasks)
          return newTimers
        })
      }
      
      if (isOnManualBreak && !isBreakPaused && manualBreakStartTime && user) {
        const currentTime = new Date()
        const currentHour = currentTime.getHours()
        
        if (currentHour >= 6 && currentHour < 12) {
          // Break time is calculated dynamically in getCurrentBreakTime(), no need to increment here
        } else {
          if (manualBreakStartTime) {
            const breakDuration = Math.floor((Date.now() - manualBreakStartTime) / 1000)
            setTotalBreakTime(prev => prev + breakDuration)
          }
          setIsOnManualBreak(false)
          setManualBreakStartTime(null)
          setIsBreakPaused(false)
          setBreakPauseStartTime(null)
          if (user) {
            saveUserTimerData(user.id, taskTimers, activeTaskId, isPaused, false, null, totalBreakTime, false, null, startedTasks)
          }
          toast({
            title: "Break Ended",
            description: "Break window closed at 12 PM. You can now start tasks",
          })
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [activeTaskId, isPaused, user, taskTimers, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime])

  useEffect(() => {
    if (user) {
      saveUserTimerData(user.id, taskTimers, activeTaskId, isPaused, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime, startedTasks)
    }
  }, [taskTimers, activeTaskId, isPaused, user, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime, startedTasks])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    
    if (!token || !userData) {
      navigate('/', { replace: true })
      return
    }
    
    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== 'employee') {
      navigate('/superior', { replace: true })
      return
    }
    
    setUser(parsedUser)

    const userTimerData = loadUserTimerData(parsedUser.id)
    
    const lastActiveDate = localStorage.getItem(getUserLastActiveDateKey(parsedUser.id))
    const today = new Date().toDateString()
    
    if (lastActiveDate && lastActiveDate !== today) {
      localStorage.removeItem(getUserTimerKey(parsedUser.id))
      localStorage.removeItem(getUserActiveTaskKey(parsedUser.id))
      localStorage.removeItem(getUserPausedKey(parsedUser.id))
      localStorage.removeItem(getUserManualBreakKey(parsedUser.id))
      localStorage.removeItem(getUserManualBreakStartTimeKey(parsedUser.id))
      localStorage.removeItem(getUserTotalBreakTimeKey(parsedUser.id))
      localStorage.removeItem(getUserBreakPausedKey(parsedUser.id))
      localStorage.removeItem(getUserBreakPauseStartTimeKey(parsedUser.id))
      localStorage.removeItem(getUserStartedTasksKey(parsedUser.id))
      setTaskTimers({})
      setActiveTaskId(null)
      setIsPaused(false)
      setIsOnManualBreak(false)
      setManualBreakStartTime(null)
      setTotalBreakTime(0)
      setIsBreakPaused(false)
      setBreakPauseStartTime(null)
      setStartedTasks(new Set())
    } else {
      setTaskTimers(userTimerData.timers)
      setActiveTaskId(userTimerData.activeTaskId)
      setIsPaused(userTimerData.isPaused)
      setIsOnManualBreak(userTimerData.isOnManualBreak)
      setManualBreakStartTime(userTimerData.manualBreakStartTime)
      setTotalBreakTime(userTimerData.totalBreakTime)
      setIsBreakPaused(userTimerData.isBreakPaused)
      setBreakPauseStartTime(userTimerData.breakPauseStartTime)
      setStartedTasks(userTimerData.startedTasks)
    }
    
    localStorage.setItem(getUserLastActiveDateKey(parsedUser.id), today)
    
    setIsLoadingTasks(true)
    setIsLoadingQueries(true)
    setIsLoadingQueryReplies(true)
  }, [navigate])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoadingTasks(true)
        const token = localStorage.getItem('authToken')
        
        if (!token) {
          return
        }

        const response = await axios.get('http://localhost:5014/api/Task', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const transformedTasks = response.data.map(task => ({
          task_id: task.taskId,
          title: task.title,
          description: task.description,
          estimated_hours: task.estimatedHours,
          assigned_by: task.assignedBy,
          is_public: task.isPublic,
          created_at: task.createdAt
        }))

        setTasks(transformedTasks)
      } catch (error) {
        console.error('Error fetching tasks:', error)
        toast({
          title: "Error fetching tasks",
          description: "Failed to load tasks from server",
          variant: "destructive"
        })
      } finally {
        setIsLoadingTasks(false)
      }
    }

    if (user && isLoadingTasks) {
      fetchTasks()
    }
  }, [user, toast, isLoadingTasks])

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setIsLoadingQueries(true)
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')
        
        if (!token || !userData) {
          return
        }

        const parsedUser = JSON.parse(userData)
        const currentUserId = parsedUser.userId || parsedUser.id || parsedUser.ID

        console.log('Current User ID:', currentUserId, 'Type:', typeof currentUserId)
        console.log('Full user data:', parsedUser)

        const response = await axios.get('http://localhost:5014/api/Queries', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('All queries from API:', response.data)

        const userQueries = response.data.filter(query => {
          console.log(`Query ${query.queryId}: raisedBy=${query.raisedBy} (type: ${typeof query.raisedBy}), currentUserId=${currentUserId} (type: ${typeof currentUserId})`) // Debug log
          return query.raisedBy == currentUserId || query.raisedBy === currentUserId
        })

        console.log('Filtered user queries:', userQueries)
        setQueries(userQueries)
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

    if (user && isLoadingQueries) {
      fetchQueries()
    }
  }, [user, toast, isLoadingQueries])

  useEffect(() => {
    const fetchAllQueryReplies = async () => {
      try {
        setIsLoadingQueryReplies(true)
        const token = localStorage.getItem('authToken')
        
        if (!token) {
          toast({
            title: "Authentication Error",
            description: "Please login again to view query replies",
            variant: "destructive"
          })
          return
        }

        const response = await axios.get('http://localhost:5014/api/QueryReplies', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        console.log('Fetched query replies from API:', response.data)
        setAllQueryRepliesFromAPI(response.data)
      } catch (error) {
        console.error('Error fetching query replies:', error)
        toast({
          title: "Error fetching query replies",
          description: "Failed to load query replies from server",
          variant: "destructive"
        })
      } finally {
        setIsLoadingQueryReplies(false)
      }
    }

    if (user && isLoadingQueryReplies) {
      fetchAllQueryReplies()
    }
  }, [user, toast, isLoadingQueryReplies])

  const getQueryReplies = (queryId) => {
    return allQueryRepliesFromAPI.filter(reply => reply.queryId === queryId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
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

  if (!user || isLoadingTasks || isLoadingQueries || isLoadingQueryReplies) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!user ? 'Loading user data...' : 
             isLoadingTasks ? 'Loading tasks...' : 
             isLoadingQueries ? 'Loading queries...' :
             'Loading query replies...'}
          </p>
        </div>
      </div>
    )
  }

  const formatTime = (seconds) => {
    if (!seconds) return "00:00:00"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatRelativeTime = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMs = now - date
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMinutes < 1) {
      return 'Just now'
    } else if (diffInHours < 1) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
    } else if (diffInDays < 1) {
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

  const isBreakTimeWindow = () => {
    const currentHour = currentTime.getHours()
    return currentHour >= 6 && currentHour < 12
  }

  const handleManualBreak = () => {
    if (!isOnManualBreak) {
      if (activeTaskId) {
        setActiveTaskId(null)
        setIsPaused(false)
      }
      
      setIsOnManualBreak(true)
      setManualBreakStartTime(Date.now())
      setIsBreakPaused(false)
      setBreakPauseStartTime(null)
      if (user) {
        saveUserTimerData(user.id, taskTimers, null, false, true, Date.now(), totalBreakTime, false, null, startedTasks)
      }
      toast({
        title: "Break Started",
        description: "All tasks stopped. Break time tracking has started",
      })
    } else {
      if (manualBreakStartTime && !isBreakPaused) {
        const breakDuration = Math.floor((Date.now() - manualBreakStartTime) / 1000)
        setTotalBreakTime(prev => prev + breakDuration)
      } else if (isBreakPaused && breakPauseStartTime) {
        const timeUntilPause = Math.floor((breakPauseStartTime - manualBreakStartTime) / 1000)
        setTotalBreakTime(prev => prev + timeUntilPause)
      }
      setIsOnManualBreak(false)
      setManualBreakStartTime(null)
      setIsBreakPaused(false)
      setBreakPauseStartTime(null)
      if (user) {
        saveUserTimerData(user.id, taskTimers, activeTaskId, isPaused, false, null, totalBreakTime, false, null, startedTasks)
      }
      toast({
        title: "Break Ended",
        description: "Break time tracking has stopped. You can now start tasks",
      })
    }
  }

  const handleBreakPause = () => {
    if (!isOnManualBreak) return

    if (!isBreakPaused) {
      if (manualBreakStartTime) {
        const breakDuration = Math.floor((Date.now() - manualBreakStartTime) / 1000)
        setTotalBreakTime(prev => prev + breakDuration)
      }
      setIsBreakPaused(true)
      setBreakPauseStartTime(Date.now())
      if (user) {
        saveUserTimerData(user.id, taskTimers, activeTaskId, isPaused, isOnManualBreak, manualBreakStartTime, totalBreakTime, true, Date.now(), startedTasks)
      }
      toast({
        title: "Break Paused",
        description: "Break time tracking paused",
      })
    } else {
      // Resume break
      setIsBreakPaused(false)
      setManualBreakStartTime(Date.now())
      setBreakPauseStartTime(null)
      if (user) {
        saveUserTimerData(user.id, taskTimers, activeTaskId, isPaused, isOnManualBreak, Date.now(), totalBreakTime, false, null, startedTasks)
      }
      toast({
        title: "Break Resumed",
        description: "Break time tracking resumed",
      })
    }
  }

  const startTask = async (taskId) => {
    if (isOnManualBreak) {
      toast({
        title: "Cannot start task",
        description: "Please stop your break first before starting a task",
        variant: "destructive"
      })
      return
    }
    
    if (activeTaskId && activeTaskId !== taskId) {
      stopCurrentTask()
    }
    
    const isFirstTimeStart = !startedTasks.has(taskId)
    
    if (isFirstTimeStart) {
      try {
        const token = localStorage.getItem('authToken')
        const userData = localStorage.getItem('userData')
        
        if (!token || !userData) {
          toast({
            title: "Authentication Error",
            description: "Please login again to start tasks",
            variant: "destructive"
          })
          return
        }

        const parsedUser = JSON.parse(userData)
        const userId = parsedUser.userId || parsedUser.id || parsedUser.ID

        const assignmentPayload = {
          taskId: taskId,
          userId: userId
        }

        await axios.post('http://localhost:5014/api/TaskAssignment', assignmentPayload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        const newStartedTasks = new Set(startedTasks)
        newStartedTasks.add(taskId)
        setStartedTasks(newStartedTasks)

        console.log('Task assignment API called successfully for task:', taskId)
      } catch (error) {
        console.error('Error calling TaskAssignment API:', error)
        toast({
          title: "Assignment Error",
          description: "Failed to assign task, but timer will start anyway",
          variant: "destructive"
        })
        const newStartedTasks = new Set(startedTasks)
        newStartedTasks.add(taskId)
        setStartedTasks(newStartedTasks)
      }
    }
    
    setActiveTaskId(taskId)
    setIsPaused(false)
    if (user) {
      saveUserTimerData(user.id, taskTimers, taskId, false, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime, startedTasks)
    }
  }

  const pauseTimer = () => {
    if (isOnManualBreak) {
      return
    }
    
    setIsPaused(true)
    if (user) {
      saveUserTimerData(user.id, taskTimers, activeTaskId, true, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime, startedTasks)
    }
  }

  const resumeTimer = () => {
    if (isOnManualBreak) {
      toast({
        title: "Cannot resume task",
        description: "Please stop your break first before resuming a task",
        variant: "destructive"
      })
      return
    }
    
    setIsPaused(false)
    if (user) {
      saveUserTimerData(user.id, taskTimers, activeTaskId, false, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime, startedTasks)
    }
  }

  const stopCurrentTask = () => {
    setActiveTaskId(null)
    setIsPaused(false)
    if (user) {
      saveUserTimerData(user.id, taskTimers, null, false, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime, startedTasks)
    }
  }

  const stopTask = (taskId) => {
    if (activeTaskId === taskId) {
      setActiveTaskId(null)
      setIsPaused(false)
      if (user) {
        saveUserTimerData(user.id, taskTimers, null, false, isOnManualBreak, manualBreakStartTime, totalBreakTime, isBreakPaused, breakPauseStartTime, startedTasks)
      }
    }
  }

  const getTotalTimeSpent = () => {
    return Object.values(taskTimers).reduce((total, time) => total + time, 0)
  }

  const getCurrentBreakTime = () => {
    let currentBreakTime = totalBreakTime
    
    // Add current active break duration for display
    if (isOnManualBreak && !isBreakPaused && manualBreakStartTime) {
      const currentBreakDuration = Math.floor((Date.now() - manualBreakStartTime) / 1000)
      currentBreakTime += currentBreakDuration
    }
    
    return currentBreakTime
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.estimated_hours) {
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login again to add tasks",
          variant: "destructive"
        })
        return
      }

      const taskPayload = {
        title: newTask.title.trim(),
        description: newTask.description.trim(),
        estimatedHours: parseFloat(newTask.estimated_hours),
        assignedBy: 2
      }

      const response = await axios.post('http://localhost:5014/api/Task', taskPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setNewTask({
        title: '',
        description: '',
        estimated_hours: '',
        assigned_by: ''
      })
      setIsAddTaskOpen(false)
      
      toast({
        title: "Task added successfully",
        description: `Task "${taskPayload.title}" has been added to your list`,
      })

      setIsLoadingTasks(true)

    } catch (error) {
      console.error('Error adding task:', error)
      toast({
        title: "Error adding task",
        description: "Failed to add task to server. Please try again.",
        variant: "destructive"
      })
    }
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

  const handleOpenQueryModal = (task) => {
    setSelectedTaskForQuery(task)
    setIsQueryModalOpen(true)
    setQueryForm({
      subject: '',
      description: ''
    })
  }

  const handleSubmitQuery = async () => {
    if (!queryForm.subject.trim() || !queryForm.description.trim() || !selectedTaskForQuery) {
      return
    }

    try {
      const token = localStorage.getItem('authToken')
      const userData = localStorage.getItem('userData')
      
      if (!token || !userData) {
        toast({
          title: "Authentication Error",
          description: "Please login again to submit queries",
          variant: "destructive"
        })
        return
      }

      const parsedUser = JSON.parse(userData)
      
      console.log('User data from localStorage:', parsedUser)
      
      const userId = parsedUser.userId || parsedUser.id || parsedUser.ID
      
      if (!userId) {
        console.error('No user ID found in localStorage userData:', parsedUser)
        toast({
          title: "Error submitting query",
          description: "User ID not found. Please try logging in again.",
          variant: "destructive"
        })
        return
      }
      
      const queryPayload = {
        taskId: selectedTaskForQuery.task_id,
        raisedBy: userId,
        subject: queryForm.subject.trim(),
        description: queryForm.description.trim()
      }

      const response = await axios.post('http://localhost:5014/api/Queries', queryPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      setQueryForm({
        subject: '',
        description: ''
      })
      setSelectedTaskForQuery(null)
      setIsQueryModalOpen(false)
      
      toast({
        title: "Query submitted successfully",
        description: `Your query "${queryPayload.subject}" has been submitted for review`,
      })

      setIsLoadingQueries(true)
      setIsLoadingQueryReplies(true)

    } catch (error) {
      console.error('Error submitting query:', error)
      toast({
        title: "Error submitting query",
        description: "Failed to submit query to server. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleCancelQuery = () => {
    setQueryForm({
      subject: '',
      description: ''
    })
    setSelectedTaskForQuery(null)
    setIsQueryModalOpen(false)
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
                {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || 'Employee'}!
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
                    
                    {isOnManualBreak && (
                      <Alert className="mb-4 bg-orange-50 border-orange-200">
                        <Coffee className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          Task controls disabled - You are on manual break
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-center space-x-3">
                      {!isPaused ? (
                        <Button 
                          onClick={pauseTimer} 
                          variant="outline" 
                          size="sm"
                          disabled={isOnManualBreak}
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                      ) : (
                        <Button 
                          onClick={resumeTimer} 
                          className="bg-green-600 hover:bg-green-700" 
                          size="sm"
                          disabled={isOnManualBreak}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Resume
                        </Button>
                      )}
                      
                      <Button 
                        onClick={() => stopTask(activeTaskId)} 
                        variant="outline" 
                        size="sm"
                        disabled={isOnManualBreak}
                      >
                        <Square className="w-4 h-4 mr-2" />
                        Stop
                      </Button>
                      
                      {/* Show break controls during break window OR when already on break */}
                      {(isBreakTimeWindow() || isOnManualBreak) && (
                        <>
                          <Button 
                            onClick={handleManualBreak}
                            variant={isOnManualBreak ? "destructive" : "outline"} 
                            size="sm"
                            className={isOnManualBreak ? "bg-red-600 hover:bg-red-700" : ""}
                          >
                            <Coffee className="w-4 h-4 mr-2" />
                            {isOnManualBreak ? 'Stop Break' : 'Start Break'}
                          </Button>
                          
                          {isOnManualBreak && (
                            <Button 
                              onClick={handleBreakPause}
                              variant="outline" 
                              size="sm"
                            >
                              {isBreakPaused ? (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Resume Break
                                </>
                              ) : (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause Break
                                </>
                              )}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Task</h3>
                  <p className="text-gray-600 mb-4">
                    {isOnManualBreak 
                      ? "Stop your break to start tracking time on tasks" 
                      : "Select a task from below to start tracking time"
                    }
                  </p>
                  {isOnManualBreak && (
                    <Alert className="bg-orange-50 border-orange-200 mb-4">
                      <Coffee className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-orange-800">
                        You are currently on manual break - Task controls are disabled
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {/* Break controls - always show during break window or when on break */}
                  {(isBreakTimeWindow() || isOnManualBreak) && (
                    <div className="flex flex-col items-center space-y-3">
                      {isOnManualBreak && (
                        <div className="text-center mb-4">
                          <div className="text-2xl font-mono font-bold text-orange-600 mb-2">
                            Break Time: {formatTime(getCurrentBreakTime())}
                          </div>
                          {isBreakPaused && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              Break Paused
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      <div className="flex justify-center space-x-3">
                        {!isOnManualBreak ? (
                          <Button 
                            onClick={handleManualBreak}
                            variant="outline" 
                            size="sm"
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                          >
                            <Coffee className="w-4 h-4 mr-2" />
                            Start Break
                          </Button>
                        ) : (
                          <>
                            <Button 
                              onClick={handleManualBreak}
                              variant="destructive" 
                              size="sm"
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Square className="w-4 h-4 mr-2" />
                              Stop Break
                            </Button>
                            
                            <Button 
                              onClick={handleBreakPause}
                              variant="outline" 
                              size="sm"
                            >
                              {isBreakPaused ? (
                                <>
                                  <Play className="w-4 h-4 mr-2" />
                                  Resume Break
                                </>
                              ) : (
                                <>
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause Break
                                </>
                              )}
                            </Button>
                          </>
                        )}
                      </div>
                      
                      {!isBreakTimeWindow() && isOnManualBreak && (
                        <Alert className="bg-yellow-50 border-yellow-200 max-w-md">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <AlertDescription className="text-yellow-800">
                            Break window has ended. Please stop your break.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}
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
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={isOnManualBreak ? (isBreakPaused ? "outline" : "default") : "secondary"}>
                    {isOnManualBreak 
                      ? (isBreakPaused ? "Break Paused" : "On Break") 
                      : (isPaused ? "Task Paused" : "Working")
                    }
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Break Window</span>
                  <Badge variant={isBreakTimeWindow() ? "default" : "secondary"}>
                    {isBreakTimeWindow() ? "Available (6 AM - 12 PM)" : "Not Available"}
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
              {tasks.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
                  <p className="text-gray-600 mb-4">You don't have any tasks assigned yet. Add a new task to get started.</p>
                </div>
              ) : (
                tasks.map(task => (
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
                              disabled={isOnManualBreak}
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                          ) : (
                            <Button 
                              onClick={resumeTimer} 
                              size="sm" 
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              disabled={isOnManualBreak}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Resume
                            </Button>
                          )}
                          <Button 
                            onClick={() => stopTask(task.task_id)} 
                            variant="outline" 
                            size="sm"
                            disabled={isOnManualBreak}
                          >
                            <Square className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          onClick={() => startTask(task.task_id)} 
                          size="sm" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={isOnManualBreak}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Start Timer
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenQueryModal(task)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Query
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="queries" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Queries</h2>
            </div>
            
            <div className="space-y-4">
              {queries.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Queries Found</h3>
                  <p className="text-gray-600 mb-4">You haven't raised any queries yet. Use the Query button on tasks to ask questions.</p>
                </div>
              ) : (
                queries.map(query => {
                  const queryReplies = getQueryReplies(query.queryId)
                  
                  return (
                    <Card key={query.queryId} className="shadow-md border-0 bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-2">{query.subject}</h3>
                            <p className="text-sm text-gray-600">{query.description}</p>
                            
                            {/* Display Query Replies - Only show for Resolved queries */}
                            {query.status === 'Resolved' && queryReplies.length > 0 && (
                              <div className="mt-4 space-y-3">
                                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                                  <MessageSquare className="w-4 h-4" />
                                  <span>Replies ({queryReplies.length})</span>
                                </h4>
                                {queryReplies.map(reply => (
                                  <div key={reply.replyId} className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                    <p className="text-blue-900">{reply.message}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge variant={query.status === 'Open' ? "destructive" : query.status === 'Resolved' ? "default" : "outline"}>
                              {query.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatRelativeTime(query.raisedAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
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
                    <span className="font-semibold">
                      {(getCurrentBreakTime() / 3600).toFixed(1)} hours
                    </span>
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

        {/* Query Modal */}
        <Dialog open={isQueryModalOpen} onOpenChange={setIsQueryModalOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Raise Query
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {selectedTaskForQuery && (
                  <>Submit a query for task: <span className="font-medium text-gray-900">"{selectedTaskForQuery.title}"</span></>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  value={queryForm.subject}
                  onChange={(e) => setQueryForm(prev => ({...prev, subject: e.target.value}))}
                  placeholder="Enter query subject"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="queryDescription" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="queryDescription"
                  value={queryForm.description}
                  onChange={(e) => setQueryForm(prev => ({...prev, description: e.target.value}))}
                  placeholder="Enter query description"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancelQuery}
                className="hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitQuery}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!queryForm.subject.trim() || !queryForm.description.trim()}
              >
                Submit Query
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default EmployeeDashboard