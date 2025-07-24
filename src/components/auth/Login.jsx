import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Clock, Eye, EyeOff } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    setTimeout(() => {
      console.log('Login data:', data)
      setIsLoading(false)
      form.reset()
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex-1 relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4 lg:p-8 min-h-[40vh] lg:min-h-screen">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 max-w-md text-center text-white">
          <div className="mb-6 lg:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-2xl lg:rounded-3xl mb-4 lg:mb-6 backdrop-blur-sm">
              <Clock className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4">Task & Attendance Management</h2>
            <p className="text-blue-100 text-sm sm:text-base lg:text-lg leading-relaxed px-4 lg:px-0">
              Streamline your workforce management with our comprehensive task tracking and attendance monitoring system.
            </p>
          </div>
          
          <div className="space-y-3 lg:space-y-4 text-blue-100 text-sm lg:text-base">
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
              </div>
              <span>Real-time task tracking</span>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
              </div>
              <span>Attendance monitoring</span>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <EyeOff className="w-3 h-3 lg:w-4 lg:h-4" />
              </div>
              <span>Performance analytics</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[60vh] lg:min-h-screen">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">PropVivo</h1>
            <p className="text-gray-600 text-sm">Sign in to continue</p>
          </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl font-semibold text-center text-gray-900">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-sm">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your email"
                          type="email"
                          className="h-10 sm:h-11 border-0 focus:border-0 focus:ring-0 outline-none focus:outline-none bg-gray-100 focus:bg-white text-sm sm:text-base rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Enter your password"
                            type={showPassword ? 'text' : 'password'}
                            className="h-10 sm:h-11 pr-10 border-0 focus:border-0 focus:ring-0 outline-none focus:outline-none bg-gray-100 focus:bg-white text-sm sm:text-base rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 sm:h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 lg:mt-8 text-xs sm:text-sm text-gray-500">
          <p>© 2025 PropVivo. All rights reserved.</p>
          <p className="mt-1 px-4 sm:px-0">Homeland City, Nr. SNS Business Park, Vesu, Surat</p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Login