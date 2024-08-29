import {useEffect} from 'react'
import { goToLoginPage } from '../routes/coordinator'

export const useProtectedPage = (navigate) => {
    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser")
        if(!currentUser){
            goToLoginPage(navigate)
        }
    }, [navigate])
}