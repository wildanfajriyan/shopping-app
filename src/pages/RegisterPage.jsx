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
import { Input } from '@/components/ui/input';
import {
  Form,
  FormItem,
  FormMessage,
  FormLabel,
  FormField,
  FormControl,
} from '@/components/ui/form';
import { axiosInstance } from '@/lib/axios';
import { GuestPage } from '@/components/guard/GuestPage';

const registerFormSchema = z
  .object({
    username: z
      .string()
      .min(3, 'Username has to be between 3 and 16 characters')
      .max(16, 'Username has to be between 3 and 16 characters'),
    password: z
      .string()
      .min(8, 'Your password needs to be 8 characters or more'),
    repeatPassword: z.string().min(8, 'Make sure your password match'),
  })
  .superRefine(({ password, repeatPassword }, ctx) => {
    if (password !== repeatPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password do not match',
        path: ['repeatPassword'],
      });
    }
  });

const RegisterPage = () => {
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      repeatPassword: '',
    },
    resolver: zodResolver(registerFormSchema),
    reValidateMode: 'onSubmit',
  });

  const handleRegister = async (values) => {
    try {
      const userResponse = await axiosInstance.get('/users', {
        params: {
          username: values.username,
        },
      });

      if (userResponse.data.length) {
        alert('username already taken');
        return;
      }

      await axiosInstance.post('/users', {
        username: values.username,
        password: values.password,
        role: 'user',
      });

      alert('user registerd');
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
            onSubmit={form.handleSubmit(handleRegister)}
            className="w-full max-w-[540px]"
          >
            <Card>
              <CardHeader>
                <CardTitle>Create an acccunt!</CardTitle>
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
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repeat Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <div className="flex flex-col space-y-4 w-full">
                  <Button type="submit">Register</Button>
                  <Button variant="link">Login instead</Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </GuestPage>
  );
};

export default RegisterPage;
