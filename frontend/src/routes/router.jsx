import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage } from '../pages/login/LoginPage'
import { SignUpPage } from '../pages/signup/SignUpPage'
import { Homepage } from '../pages/homepage/Homepage'
import { PizzaMenu } from '../pages/pizzaMenu/PizzaMenu'
import { ListOfOptions } from '../pages/ListOfOptions/ListOfOptions'
import Cart from '../pages/CartPage/Cart'
import { Navbar } from '../components/Navbar/Navbar'
import { Checkout } from '../pages/Checkout/Checkout'
import { useSelector } from 'react-redux'
import { DrinksMenu } from '../pages/drinksMenu/DrinksMenu'
import { DessertsMenu } from '../pages/dessertsMenu/DessertsMenu'
import { SnacksMenu } from '../pages/snacksMenu/SnacksMenu'


export const Router = () => {
  const { currentUser } = useSelector((rootReducer) => rootReducer.userReducer);
  return (
    <BrowserRouter> 
      <Navbar />
      <Routes> 
        <Route path='/' element={<Homepage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/pizzas' element={<PizzaMenu />} />
        <Route path='/bebidas' element={<DrinksMenu />} />
        <Route path='/sobremesas' element={<DessertsMenu />}/>
        <Route path='/aperitivos' element={<SnacksMenu />}/>
        <Route path='/listofoptions' element={<ListOfOptions />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/checkout' element={<Checkout />} />
        
      </Routes>
    </BrowserRouter>
  );
};