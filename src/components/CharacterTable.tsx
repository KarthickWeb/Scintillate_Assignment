import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Spinner,
  Center,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import Pagination from './Pagination';
import { useFavorites } from './FavoritesContext';

interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  url: string;
}

const CharacterTable: React.FC = () => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?page=${currentPage}`);
        setCharacters(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching characters:', error);
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  const handleFavoriteClick = (name: string) => {
    if (favorites.includes(name)) {
      removeFavorite(name);
    } else {
      addFavorite(name);
    }
  };

  const getCharacterId = (url: string) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  return (
    <>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Height</Th>
              <Th>Mass</Th>
              <Th>Hair Color</Th>
              <Th>Skin Color</Th>
              <Th>Eye Color</Th>
              <Th>Birth Year</Th>
              <Th>Gender</Th>
              <Th>Favorite</Th>
            </Tr>
          </Thead>
          <Tbody>
            {characters.map((character) => (
              <Tr key={character.name}>
                <Td>
                  <Link as={RouterLink} to={`/character/${getCharacterId(character.url)}`}>
                    {character.name}
                  </Link>
                </Td>
                <Td>{character.height}</Td>
                <Td>{character.mass}</Td>
                <Td>{character.hair_color}</Td>
                <Td>{character.skin_color}</Td>
                <Td>{character.eye_color}</Td>
                <Td>{character.birth_year}</Td>
                <Td>{character.gender}</Td>
                <Td>
                  <IconButton
                    aria-label={favorites.includes(character.name) ? 'Unfavorite' : 'Favorite'}
                    icon={
                      <StarIcon color={favorites.includes(character.name) ? 'yellow.400' : 'gray.400'} />
                    }
                    onClick={() => handleFavoriteClick(character.name)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        paginate={paginate}
      />
    </>
  );
};

export default CharacterTable;
