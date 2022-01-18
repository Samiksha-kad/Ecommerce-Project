import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundry'
import Invoice from './components/Invoice';
const Login = lazy(() => import('./components/Login'))
const Registration = lazy(() => import('./components/Registration'))
const Cart = lazy(() => import('./components/Cart'))
const Checkout = lazy(() => import('./components/Checkout'))
const Forgetpassword = lazy(() => import('./components/Forgetpassword'))
const Order = lazy(() => import('./components/Order'))
const Product = lazy(() => import('./components/Product'))
const Profile = lazy(() => import('./components/Profile'))
const Home = lazy(() => import('./components/Home'))
const Address = lazy(() => import('./components/Address'))
const Account = lazy(() => import('./components/Account'))
const ChangePassword = lazy(() => import('./components/ChangePassword'))
const ProductDetails = lazy(() => import('./components/ProductDetails'))


function App() {
  return (
    <div>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={
            <div className="d-flex justify-content-center" style={{height:"100vh",width:"100%",background:"white"}}>
            <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c8529f91-daaf-4193-ba2e-0c153785b4ab/d9fndfy-7ceccbdb-2a9c-4b0d-b10f-2a32bfb4cdd8.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2M4NTI5ZjkxLWRhYWYtNDE5My1iYTJlLTBjMTUzNzg1YjRhYlwvZDlmbmRmeS03Y2VjY2JkYi0yYTljLTRiMGQtYjEwZi0yYTMyYmZiNGNkZDguZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.OWXyGQSzsBACLG_bus4F-1IpGMnP-FwQZ841OLnwO5U" className="images" alt="..."
              ></img>
              </div>
              
              }> 
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} /> 
              <Route path="/forgetpassword" element={<Forgetpassword />} />

              <Route path="/product" element={<Product />} />
              <Route path="/productDetails" element={<ProductDetails />} />
              <Route path="/invoice" element={<Invoice />} />
              {/* Nested Routing */}
              <Route path="/account" element={<Account />}> {/*parent component*/}
                <Route path="address" element={<Address />} />{/*children component*/}
                <Route path="order" element={<Order />} />{/*children component*/}
                <Route path="profile" element={<Profile />} />{/*children component*/}
                <Route path="changePass" element={<ChangePassword />} />{/*children component*/}
              </Route>
              <Route path="*" element={<img width="100%" height="750px" src="https://miro.medium.com/max/1400/1*zBFBJktPD3_z0S_35kO5Hg.gif" alt="not found" />} />
            </Routes>     
          </Suspense>
        </ErrorBoundary>
      </Router>
    </div>
  );
}

export default App;
