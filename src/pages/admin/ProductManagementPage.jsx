import { useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import { axiosInstance } from '@/lib/axios';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ProductManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [pages, setPages] = useState(0);
  const [productName, setProductName] = useState('');

  const handleNextPage = () => {
    searchParams.set('page', Number(searchParams.get('page')) + 1);

    setSearchParams(searchParams);
  };

  const handlePreviousPage = () => {
    searchParams.set('page', Number(searchParams.get('page')) - 1);

    setSearchParams(searchParams);
  };

  const getProducts = async () => {
    try {
      const response = await axiosInstance.get('/products', {
        params: {
          _per_page: 5,
          _page: Number(searchParams.get('page')),
          name: searchParams.get('search'),
        },
      });

      setPages(response.data.pages);
      setHasNextPage(Boolean(response.data.next));
      setProducts(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const searchProduct = () => {
    if (productName) {
      searchParams.set('search', productName);

      setSearchParams(searchParams);
      setProductName('');
    } else {
      searchParams.delete('search');

      setSearchParams(searchParams);
    }
  };

  useEffect(() => {
    if (searchParams.get('page')) {
      getProducts();
    }
  }, [searchParams.get('page'), searchParams.get('search')]);

  useEffect(() => {
    if (!searchParams.get('page')) {
      searchParams.set('page', 1);

      setSearchParams(searchParams);
    }
  }, []);

  return (
    <div>
      <AdminLayout
        title="Product Management"
        description="Managing our products"
        rightSection={
          <Link to="/admin/products/create">
            <Button>
              <IoAdd className="h-6 w-6 mr-2" />
              Add Product
            </Button>
          </Link>
        }
      >
        <div className="mb-8">
          <Label>Search Product Name</Label>
          <div className="flex gap-4">
            <Input
              onChange={(e) => setProductName(e.target.value)}
              value={productName}
              className="max-w-[400px]"
            />
            <Button onClick={searchProduct}>Search</Button>
          </div>
        </div>

        <Table className="p-4 border rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Number(searchParams.get('page')) > pages ||
            Number(searchParams.get('page')) < 1 ? (
              <TableRow></TableRow>
            ) : (
              products.map((product) => (
                <>
                  <TableRow>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      Rp {product.price.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <Ellipsis className="w-6 h-6" />
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <Button
                disabled={searchParams.get('page') === '1'}
                onClick={handlePreviousPage}
                variant="ghost"
              >
                <ChevronLeft className="w-6 h-6 mr-2" /> Previous
              </Button>
            </PaginationItem>

            <PaginationItem className="mx-8 font-semibold">
              Page {searchParams.get('page')}
            </PaginationItem>

            <PaginationItem>
              <Button
                disabled={!hasNextPage}
                onClick={handleNextPage}
                variant="ghost"
              >
                Next <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </AdminLayout>
    </div>
  );
};

export default ProductManagementPage;
