import { useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { goToCheckoutPage, goToLoginPage } from "../../routes/coordinator";
import { useCart } from "../../context/CartContext";
import { useOtherProductsCart } from "../../context/OtherProductsCartContext";

const CheckoutFormPage = () => {
    const [form, onChangeInputs, clearInputs] = useForm({
        name: "",
        phone: "",
        address: "",
        number: "",
        optional: "",
        city: "",
        zipCode: "",
    });

    const { clearCart } = useCart();

    const { clearCartOtherProducts } = useOtherProductsCart();

    const onSubmit = (e) => {
        e.preventDefault();
        clearInputs();
    };

    const navigate = useNavigate()

    const handleSubmitForm = () => {
        clearCart();
        clearCartOtherProducts();
        navigate("/checkout")
    }

    return (
        <div className="min-h-96 bg-black text-white flex flex-col justify-center items-center p-2">

            <form onSubmit={onSubmit} className="w-fit p-6 flex flex-col space-y-2 bg-orange-400">
                <h1 className="text-4xl mb-4">Preencha Seu Endereço para Entrega</h1>
                <h2 className="text-2xl"><span className="cursor-pointer hover:text-blue-700" onClick={() => goToLoginPage(navigate)}>Faça login</span> e aproveite nossas vantagens e promoções!</h2>
                <label htmlFor="name">Nome:</label>
                <input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChangeInputs}
                    className="p-2 text-black"
                    required
                />

                <label htmlFor="phone">Telefone com DDD (somente números):</label>
                <input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={onChangeInputs}
                    className="p-2 text-black"
                    required
                />

                <label htmlFor="address">Endereço:</label>
                <input
                    id="address"
                    name="address"
                    value={form.address}
                    onChange={onChangeInputs}
                    className="p-2 text-black"
                    required
                />

                <label htmlFor="number">Número:</label>
                <input
                    id="number"
                    name="number"
                    value={form.number}
                    onChange={onChangeInputs}
                    className="p-2 text-black"
                    required
                />

                <label htmlFor="optional">Complemento:</label>
                <input
                    id="optional"
                    name="optional"
                    value={form.optional}
                    onChange={onChangeInputs}
                    className="p-2 text-black"
                />

                <label htmlFor="city">Cidade:</label>
                <input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={onChangeInputs}
                    className="p-2 text-black"
                    required
                />

                <label htmlFor="zipCode">CEP:</label>
                <input
                    id="zipCode"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={onChangeInputs}
                    className="p-2 text-black"
                    required
                />

                <label htmlFor="optional">Informações adicionais</label>
                <textarea className="h-24 resize-none" name="optional" id="optional"></textarea>

                <button onClick={handleSubmitForm} type="submit" className="mt-4 p-2 bg-white text-black">
                    Confirmar
                </button>
            </form>
        </div>
    );
};

export default CheckoutFormPage;
