import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card, CardImg} from 'react-bootstrap';
import { useState, useEffect } from 'react';

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // API Access Token
    
  }, [])

  // Search
  async function search() {
    console.log("Searched for " + searchInput)

    // Get retuest with Arist Id grab all the albums from the artist
    await fetch('/search_playlist_by_artist/' + searchInput)
      .then(response => response.json())
      .then(data => setAlbums(data.items))
  }

  
  // console.log(albums);

  return (
    <div className="App">
      <Container>
        <InputGroup className="mb-3" size="lg"> 
          <FormControl
            placeholder='Search For Artist'
            type='input'
            onKeyDown={event => {
              if (event.key === "Enter") {
                console.log('Pressed enter');
                search();
              }
            }}
            onChange={event => setSearchInput(event.target.value)}
          />
          <Button onClick={() => {search()}}>
            Search
          </Button>
        </InputGroup>
      </Container>
      <Container>
        <Row className='mx-2 row row-cols-4'>
          {albums.map((album, i) =>  {
            return (
              <Card>
                <CardImg src={album.images[0].url}/>
                <Card.Body>
                  <Card.Title>{album.name}</Card.Title>
                </Card.Body>
              </Card>
              )
          } )}
          
        </Row>
      </Container>
    </div>
  );
}

export default App;
