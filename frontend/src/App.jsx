import './App.css';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Router } from './routes/router'
import { CartProvider } from "./context/CartContext";
import { OtherProductsCartProvider } from "./context/OtherProductsCartContext"

function App() {
  return (
    <CartProvider>
      <OtherProductsCartProvider>
        <div className="App">
          <Header />
          <Router />
          <Footer />
        </div>
      </OtherProductsCartProvider>
    </CartProvider>


  );
}

export default App;
