import { useAuthContext } from "./useAuthContext"
import { usePlaylistContext } from "./usePlaylistContext"

export const useLogout = () => {
    
    const { dispatch } = useAuthContext()
    const { dispatch: playlistDispatch } = usePlaylistContext()

    const logout = () => {
        // remove user from storage
        localStorage.removeItem('user')
        
        // dispatch logout action
        dispatch({type: 'LOGOUT'})
        playlistDispatch({type:'SET_PLAYLISTS', payload: null})
        

        window.open("http://localhost:8888/api/user/auth/google/logout", "_self");
    }

    return {logout}
}