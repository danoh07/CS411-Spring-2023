import { createContext, useReducer, useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { 
    user: null
  })

  useEffect(() => {

    const getGoogleUser = async () => {

      try {
        const response = await fetch('/api/user/auth/google/login/success', {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
          }})
    
        const json = await response.json()

        if (response.status == 200) {
          // save the user to local storage
          localStorage.setItem('user', JSON.stringify(json))
          // update the auth context
          dispatch({type: 'LOGIN', payload: json})
      }
    } catch (error) {
      console.log(error)
    }

    }

    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      dispatch({ type: 'LOGIN', payload: user }) 
    } else {
      getGoogleUser()
    }
    
  }, [])

  console.log('AuthContext state:', state)
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      { children }
    </AuthContext.Provider>
  )

}