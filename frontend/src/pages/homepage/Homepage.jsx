import { useNavigate } from "react-router-dom";
import img from "../../assets/chef.png";
import { goToListOfOptionsPage, goToLoginPage, goToSignUpPage } from "../../routes/coordinator";

export const Homepage = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col min-h-[75vh] bg-black p-24">
            <div>
                <h3 className="mr-5 text-5xl text-orange-500 cursor-pointer hover:text-blue-500 w-fit" onClick={() => goToListOfOptionsPage(navigate)}>
                    Conheça nosso cardápio!
                </h3>
                <div className="flex flex-col md:flex-row items-center m-5 gap-4">
                    <div className="flex flex-wrap w-full md:w-3/4 gap-4">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQRzHq1cwWSplqrvMQlfhtSuxDSjbUyNZvJA&usqp=CAU"
                            alt="Pizza de Calabresa"
                            className="w-full md:w-1/3 h-48 object-cover"
                        />

                        <img
                            src="https://www.designi.com.br/images/preview/10072860.jpg"
                            alt="Pizza de Chocolate"
                            className="w-full md:w-1/3 h-48 object-cover"
                        />

                        <img
                            src="https://i.ytimg.com/vi/aFUdE8cX7AQ/maxresdefault.jpg"
                            alt="Frango a Passarinho"
                            className="w-full md:w-1/3 h-48 object-cover"
                        />
                        <img
                            src="https://www.cidadeoferta.com.br/storage/offers/9295-chopp-club-grill-londrina-porcao-fritas-mandioca-polenta-imagem-4.jpg"
                            alt="Batatas Fritas"
                            className="w-full md:w-1/3 h-48 object-cover"
                        />
                        <img
                            src="https://cdn-productdbimages.barry-callebaut.com/sites/bc_productdb_images/files/styles/mdp_web_gm_chocac-detail/public/externals/f7537efd25f981345a3e53e9b767cd43.jpg?itok=0M0XTW2s"
                            alt="Bolo Brigadeiro"
                            className="w-full md:w-1/3 h-48 object-cover"
                        />
                        <img
                            src="https://s2-receitas.glbimg.com/yMB7rtVMoW9WyF2KDR4zkU-G92w=/0x0:1366x768/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_1f540e0b94d8437dbbc39d567a1dee68/internal_photos/bs/2022/N/E/OEOJRtSa6pywDe993Gfg/bolo-de-morango-com-chantilly-receita-2.jpg"
                            alt="Bolo de Morango"
                            className="w-full md:w-1/3 h-48 object-cover"
                        />


                    </div>
                    <img className="w-full md:w-1/4 h-auto" src={img} alt="Chef" />
                </div>
                <h2 className="mr-5 text-5xl text-orange-500 cursor-pointer hover:text-blue-500 w-fit">Cadastre-se e ganhe descontos especiais e outros benefícios!</h2>
            </div>
        </div>
    );
};



