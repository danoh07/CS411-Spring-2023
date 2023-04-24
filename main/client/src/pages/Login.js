import Google from '../img/google.png'

import { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, error, isLoading} = useLogin()

    const handleSubmit = async (e) => {
        e.preventDefault()

        await login(email, password)
    }

    const handleGoogleSubmit = () => {
        window.open("http://localhost:8888/api/user/auth/google", "_self");
    }
    

    return (
        <form className='login' onSubmit={handleSubmit}>
            <h3>Log in</h3>
            <label>Email:</label>
            <input 
                type='email'
                onChange={(e) => setEmail(e.target.value)}
                value={email} 
            />
            <label>Password:</label>
            <input 
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                value={password} 
            />
            <button disabled={isLoading}>Log in</button>
            {error && <div className='error'>{error}</div>}
            <div className="center">
                <div className="or">OR</div>
            </div>
            <div className="center">
                <div className="loginButton google" onClick={handleGoogleSubmit}>
                    <img src={Google} alt="" className="icon" />
                    Google
                </div>
            </div>
        </form>
    )
}

export default Login