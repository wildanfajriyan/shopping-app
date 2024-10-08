import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormItem,
  FormMessage,
  FormLabel,
  FormField,
  FormControl,
} from '@/components/ui/form';
import { axiosInstance } from '@/lib/axios';
import { useDispatch } from 'react-redux';
import { GuestPage } from '@/components/guard/GuestPage';

const loginFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username has to be between 3 and 16 characters')
    .max(16, 'Username has to be between 3 and 16 characters'),
  password: z.string().min(8, 'Your password needs to be 8 characters or more'),
});

const LoginPage = () => {
  const dispatch = useDispatch();

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(loginFormSchema),
    reValidateMode: 'onSubmit',
  });

  const [isChecked, setIsChecked] = useState(false);

  const handleLogin = async (values) => {
    try {
      const userResponse = await axiosInstance.get('/users', {
        params: {
          username: values.username,
        },
      });

      if (
        !userResponse.data.length ||
        userResponse.data[0].password !== values.password
      ) {
        alert('invalid credentials');
        return;
      }

      alert(`successfully logged in as ${userResponse.data[0].username}`);
      dispatch({
        type: 'USER_LOGIN',
        payload: {
          username: userResponse.data[0].username,
          id: userResponse.data[0].id,
          role: userResponse.data[0].role,
        },
      });

      localStorage.setItem('current-user', userResponse.data[0].id);

      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GuestPage>
      <main className="px-4 container py-8 flex flex-col justify-center items-center max-w-screen-md h-[80vh]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleLogin)}
            className="w-full max-w-[540px]"
          >
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back!</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type={isChecked ? 'text' : 'password'}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    onCheckedChange={(checked) => setIsChecked(checked)}
                    id="show-password"
                  />
                  <Label htmlFor="show-password">Show Password</Label>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex flex-col space-y-4 w-full">
                  <Button type="submit">Login</Button>
                  <Button variant="link">Sign up instead</Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </GuestPage>
  );
};

export default LoginPage;
