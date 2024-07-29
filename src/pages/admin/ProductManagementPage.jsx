import { useEffect, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Edit, Trash } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';

const ProductManagementPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [pages, setPages] = useState(0);
  const [productName, setProductName] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);

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

  const handleDeleteProduct = async () => {
    const shouldDelete = confirm(
      `Are you sure want to delete ${selectedProductIds.length} product?`
    );

    if (!shouldDelete) return;

    const deletePromises = selectedProductIds.map((id) => {
      return axiosInstance.delete(`/products/${id}`);
    });

    try {
      await Promise.all(deletePromises);

      alert(`Successfully deleted ${selectedProductIds.length} products!`);

      searchParams.set('page', Number(1));
      setSearchParams(searchParams);
      setSelectedProductIds([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnCheckedProduct = async (id, checked) => {
    if (checked) {
      setSelectedProductIds([...selectedProductIds, id]);
    } else {
      const productId = selectedProductIds.findIndex((i) => {
        return i == id;
      });

      const prevSelectedProductIds = [...selectedProductIds];
      prevSelectedProductIds.splice(productId, 1);

      setSelectedProductIds(prevSelectedProductIds);
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
          <div className="flex gap-2">
            {selectedProductIds.length ? (
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Delete {selectedProductIds.length} Products
              </Button>
            ) : null}

            <Link to="/admin/products/create">
              <Button>
                <IoAdd className="h-6 w-6 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
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
              <TableHead></TableHead>
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
                    <TableCell>
                      <Checkbox
                        onCheckedChange={(checked) =>
                          handleOnCheckedProduct(product.id, checked)
                        }
                        checked={selectedProductIds.includes(product.id)}
                      />
                    </TableCell>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>
                      Rp {product.price.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <Link to={`/admin/products/edit/${product.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-6 h-6" />
                        </Button>
                      </Link>
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
