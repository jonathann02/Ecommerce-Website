import { Routes, Route, Link } from 'react-router-dom';

import { ManageCustomers } from './components/ManageCustomers';
import { CreateCustomer } from './components/CreateCustomer';
import { UpdateCustomer } from './components/UpdateCustomer';

import { ManageProducts } from './components/ManageProducts';
import { CreateProduct } from './components/CreateProduct';
import { UpdateProduct } from './components/UpdateProduct';

import { ManageOrders } from './components/ManageOrders';
import { OrderDetails } from './components/OrderDetails';

import { ShopProducts } from './shop/ShopProducts'
import { ProductDetails } from './shop/ProductDetails'
import { CartPage } from './shop/CartPage'


function App() {
  return (

    <div>
      <header>
        <h1>Välkommen</h1>
        <nav>
          <Link to="/">Hem</Link>
          <Link to="/cart">Varukorg</Link>

          <Link to="/manage-customers">Manage Customers</Link>
            <Link to="/create-customer">Create Customers</Link>
            <Link to="/manage-products">Manage Products</Link>
            <Link to="/create-product">Create Products</Link>
            <Link to="/manage-orders">Manage Orders</Link>
        </nav>
      </header>
      
      <main>
      <Routes>
        <Route path="/" element={<ShopProducts />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/manage-customers" element={<ManageCustomers />} />
        <Route path="/create-customer" element={<CreateCustomer />} />
        <Route path="/update-customer/:id" element={<UpdateCustomer />} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/create-product" element={<CreateProduct />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
        <Route path="/manage-orders" element={<ManageOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />
      </Routes>
      </main>
    </div>
  );
}

export default App; 