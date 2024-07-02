import React from 'react';
import { ChakraProvider, Container, Heading } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CharacterTable from './components/CharacterTable';
import { FavoritesProvider } from './components/FavoritesContext';
import CharacterDetail from './components/CharacterDetail';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <FavoritesProvider>
        <Router>
          <Container maxW="container.xl" py="6">
            <Heading as="h1" size="xl" mb="6">
              Star Wars Characters
            </Heading>
            <Routes>
              <Route path="/" element={<CharacterTable />} />
              <Route path="/character/:id" element={<CharacterDetail />} />
            </Routes>
          </Container>
        </Router>
      </FavoritesProvider>
    </ChakraProvider>
  );
};

export default App;
