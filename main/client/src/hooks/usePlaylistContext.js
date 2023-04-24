import { PlaylistsContext } from "../context/playlistContext";
import { useContext } from "react";

export const usePlaylistContext = () => {
    const context = useContext(PlaylistsContext)

    if (!context) {
        throw Error('usePlaylistContext must be used inside an PlaylistContextProvider')
    }

    return context
}