import { useForm } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from './ui/button';

const productFormSchema = z.object({
  name: z
    .string()
    .min(3, 'Your product name is under 3 characters')
    .max(80, 'Your product name is over 80 characters'),
  price: z.coerce.number().min(10000, 'Price cannot be under Rp 10.000'),
  stock: z.coerce.number().min(1, 'Stock cannot be under 1'),
  imageUrl: z.string().url('Use a valid URL'),
});

export const ProductForm = ({
  onSubmit,
  cardTitle,
  defaultName,
  defaultPrice,
  defaultStock,
  defaultImageUrl,
}) => {
  const form = useForm({
    defaultValues: {
      name: defaultName || '',
      price: defaultPrice || 0,
      stock: defaultStock || 0,
      imageUrl: defaultImageUrl || '',
    },
    resolver: zodResolver(productFormSchema),
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-w-[540px] w-full"
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">{cardTitle}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Product name has to be between 3 and 80 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product image</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Please use a valid image URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  );
};
