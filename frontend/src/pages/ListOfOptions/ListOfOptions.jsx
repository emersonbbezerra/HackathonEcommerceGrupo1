import dessert from "../../assets/dessert.jpg";
import drink from "../../assets/drinks.jpg";
import fries from "../../assets/fries.jpg";
import pizza from "../../assets/pizza.jpg";
import chef from "../../assets/chef.png";
import { useNavigate } from "react-router-dom";
import { goToDessertMenuPage, goToDrinkMenuPage, goToPizzaMenuPage, goToSnacksMenuPage } from "../../routes/coordinator";

export const ListOfOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white p-12">
      <div className="flex justify-around">
        
        <div className="flex flex-col justify-center">
          <div
            className="option flex items-center cursor-pointer hover:text-orange-500"
            onClick={() => goToPizzaMenuPage(navigate)}
          >
            <img src={pizza} alt="Pizzas" className="w-2/5 h-3/5 mr-12" />
            <h2 className="text-3xl font-semibold">Pizzas</h2>
          </div>
          <div className="option flex items-center cursor-pointer hover:text-green-500"
          onClick={() => goToDrinkMenuPage(navigate)}>
            <img src={drink} alt="Bebidas" className="w-2/5 h-3/5 mr-12" />
            <h2 className="text-3xl font-semibold">Bebidas</h2>
          </div>
          <div className="option flex items-center cursor-pointer hover:text-yellow-500"
          onClick={() => goToSnacksMenuPage(navigate)}>
            <img src={fries} alt="Acompanhamentos" className="w-2/5 h-3/5 mr-12" />
            <h2 className="text-3xl font-semibold">Aperitivos</h2>
          </div>
          <div className="option flex items-center cursor-pointer hover:text-blue-500"
          onClick={() => goToDessertMenuPage(navigate)}>
            <img src={dessert} alt="Sobremesas" className="w-2/5 h-3/5 mr-12" />
            <h2 className="text-3xl font-semibold">Sobremesas</h2>
          </div>
        </div>
        
        <div className="hidden lg:block w-full">
          <img src={chef} alt="Chef" className="w-7/4 h-3/4" />
        </div>
      </div>
    </div>
  );
};
