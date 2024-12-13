import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { FcGoogle } from 'react-icons/fc'
import { BsMicrosoft } from 'react-icons/bs'
import { useGoogleLogin } from '@react-oauth/google'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '@/config/auth'
import { cn } from '@/lib/utils'
import { useAuth } from '@/stores/authStore'
import { toast } from '@/hooks/use-toast'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/button'
import { PasswordInput } from '@/components/password-input'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement>

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Please enter your email' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(1, {
      message: 'Please enter your password',
    })
    .min(7, {
      message: 'Password must be at least 7 characters long',
    }),
})

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { instance } = useMsal();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await auth.login(data)
      toast({
        title: "Success!",
        description: "Redirecting to dashboard...",
      })
    } catch (error) {
      console.error('Login failed:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to login. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      console.log('Google login success, token:', response.access_token);
      setIsLoading(true)
      try {
        await auth.login({ provider: 'google', token: response.access_token })
        toast({
          title: "Success!",
          description: "Redirecting to dashboard...",
        })
      } catch (error) {
        console.error('Google login error:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to login with Google. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    },
    onError: (error) => {
      console.error('Google login error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to login with Google. Please try again.",
      })
    },
    flow: 'implicit'
  });

  const handleMicrosoftLogin = async () => {
    console.log('Attempting Microsoft login...');
    setIsLoading(true)
    try {
      // Try to login with popup and PKCE
      const response = await instance.loginPopup({
        ...loginRequest,
        prompt: 'select_account',
      });
      
      if (response?.accessToken) {
        await auth.login({ 
          provider: 'microsoft', 
          token: response.accessToken 
        });
        toast({
          title: "Success!",
          description: "Redirecting to dashboard...",
        });
      } else {
        throw new Error('No access token received');
      }
    } catch (error: any) {
      console.error('Microsoft login error:', error);
      const errorMessage = error?.errorCode === 'invalid_request' 
        ? 'Invalid login request. Please try again.'
        : 'Failed to login with Microsoft. Please try again.';
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Login
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<FcGoogle className='h-5 w-5' />}
                onClick={() => handleGoogleLogin()}
              >
                Google
              </Button>
              <Button
                variant='outline'
                className='w-full'
                type='button'
                loading={isLoading}
                leftSection={<BsMicrosoft className='h-4 w-4' />}
                onClick={handleMicrosoftLogin}
              >
                Microsoft
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
