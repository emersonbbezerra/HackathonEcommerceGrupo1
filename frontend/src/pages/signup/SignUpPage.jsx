import { useEffect, useState } from "react"
import img from "../../assets/logo.png"
import { Form, LoginPageContainer } from "./styledSignUp"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {signupUser} from "../../redux/user/actions"

export const SignUpPage = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const { currentUser } = useSelector((rootReducer) => rootReducer.userReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate("/listofoptions"); 
        }
    }, [currentUser, navigate]);

    const handleSignup = () => {
        if (!name ||!email || !password) {
            alert("Nome, email e senha são obrigatórios");
            return;
        }

        dispatch(signupUser({ name, email, password }));
    };

    return (
        <LoginPageContainer>
            <Form>
                <p className="message">Seja bem-vindo ao PizzaPalooza!</p>
                <div>
                    <img src={img} />
                    <p>Fazer cadastro</p>
                </div>
                <input value={name} type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} />
                <input value={email} type="email" placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
                <input value={password} type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
                <button onClick={handleSignup} className="flex justify-center items-center bg-blue-700 text-center text-white rounded-2text-center w-[20vw] h-[7vh] bg-darkorange text-whitesmoke text-xl font-bold rounded-lg shadow-[8px_8px_8px_rgba(0,255,0,0.5)] transform transition duration-500 ease-in-out hover:bg-orange hover:scale-110 hover:shadow-[10px_10px_10px_rgba(0,255,0,0.2)]">Cadastrar</button>
                <span>Já tem conta? Faça login!</span>
                <Link className="flex justify-center items-center bg-orange-700 text-center text-white rounded-2text-center w-[20vw] h-[7vh] bg-darkorange text-whitesmoke text-xl font-bold rounded-lg shadow-[8px_8px_8px_rgba(0,255,0,0.5)] transform transition duration-500 ease-in-out hover:bg-orange hover:scale-110 hover:shadow-[10px_10px_10px_rgba(0,255,0,0.2)]" to="/login">Entrar</Link>
            </Form>
        </LoginPageContainer>
    )

}