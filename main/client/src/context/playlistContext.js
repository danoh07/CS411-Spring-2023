import { createContext, useReducer } from 'react'

export const PlaylistsContext = createContext()

export const playlistsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PLAYLISTS':
      return { 
        playlists: action.payload 
      }
    case 'DELETE_PLAYLIST':
      return state
    default:
      return state
  }
}

export const PlaylistsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(playlistsReducer, { 
    playlists: null
  })
  
  return (
    <PlaylistsContext.Provider value={{ ...state, dispatch }}>
      { children }
    </PlaylistsContext.Provider>
  ) 
}