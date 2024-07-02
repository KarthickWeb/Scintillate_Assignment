import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Text,
  Heading,
  Spinner,
  Center,
  VStack,
  HStack,
  Stack,
  IconButton,
  Divider,
  Badge,
  Button,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { StarIcon } from '@chakra-ui/icons';

interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
}

const CharacterDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [films, setFilms] = useState<string[]>([]);
  const [species, setSpecies] = useState<string[]>([]);
  const [vehicles, setVehicles] = useState<string[]>([]);
  const [starships, setStarships] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  });

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
        setCharacter(response.data);

        const filmTitles = await Promise.all(
          response.data.films.map(async (filmUrl: string) => {
            const filmResponse = await axios.get(filmUrl);
            return filmResponse.data.title;
          })
        );
        setFilms(filmTitles);

        const speciesNames = await Promise.all(
          response.data.species.map(async (speciesUrl: string) => {
            const speciesResponse = await axios.get(speciesUrl);
            return speciesResponse.data.name;
          })
        );
        setSpecies(speciesNames);

        const vehicleNames = await Promise.all(
          response.data.vehicles.map(async (vehicleUrl: string) => {
            const vehicleResponse = await axios.get(vehicleUrl);
            return vehicleResponse.data.name;
          })
        );
        setVehicles(vehicleNames);

        const starshipNames = await Promise.all(
          response.data.starships.map(async (starshipUrl: string) => {
            const starshipResponse = await axios.get(starshipUrl);
            return starshipResponse.data.name;
          })
        );
        setStarships(starshipNames);

        // Fetch homeworld name
        const homeworldResponse: any = await axios.get(response.data.homeworld);
        setCharacter((prevCharacter: any) => ({
          ...prevCharacter,
          homeworld: homeworldResponse.data.name,
        }));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching character details:', error);
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleFavoriteClick = (name: string) => {
    let updatedFavorites;
    if (favorites.includes(name)) {
      updatedFavorites = favorites.filter(fav => fav !== name);
    } else {
      updatedFavorites = [...favorites, name];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  if (loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (!character) {
    return (
      <Center>
        <Text>Character not found</Text>
      </Center>
    );
  }

  return (
    <Center py={10}>
      <Box w="full" maxW="3xl" p={6} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
        <Stack spacing={4}>
          <Heading as="h2" size="lg" textAlign="center">
            {character.name}
            <IconButton
              aria-label={favorites.includes(character.name) ? 'Unfavorite' : 'Favorite'}
              icon={<StarIcon color={favorites.includes(character.name) ? 'yellow.400' : 'gray.400'} />}
              onClick={() => handleFavoriteClick(character.name)}
              ml={4}
            />
          </Heading>
          <Divider />
          <VStack align="start" spacing={2}>
            <HStack>
              <Text fontWeight="bold">Height:</Text>
              <Text>{character.height} cm</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Mass:</Text>
              <Text>{character.mass} kg</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Hair Color:</Text>
              <Text>{character.hair_color}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Skin Color:</Text>
              <Text>{character.skin_color}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Eye Color:</Text>
              <Text>{character.eye_color}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Birth Year:</Text>
              <Text>{character.birth_year}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Gender:</Text>
              <Text>{character.gender}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Homeworld:</Text>
              <Text>{character.homeworld}</Text>
            </HStack>
          </VStack>
          <Divider />
          <Box>
            <Heading as="h3" size="md" mt={4} mb={2}>
              Films
            </Heading>
            <VStack align="start">
              {films.length > 0 ? (
                films.map((film, index) => (
                  <Badge key={index} colorScheme="purple" variant="subtle" p={1} borderRadius="md">
                    {film}
                  </Badge>
                ))
              ) : (
                <Text>None</Text>
              )}
            </VStack>
          </Box>
          <Divider />
          <Box>
            <Heading as="h3" size="md" mt={4} mb={2}>
              Species
            </Heading>
            <VStack align="start">
              {species.length > 0 ? (
                species.map((specie, index) => (
                  <Badge key={index} colorScheme="green" variant="subtle" p={1} borderRadius="md">
                    {specie}
                  </Badge>
                ))
              ) : (
                <Text>None</Text>
              )}
            </VStack>
          </Box>
          <Divider />
          <Box>
            <Heading as="h3" size="md" mt={4} mb={2}>
              Vehicles
            </Heading>
            <VStack align="start">
              {vehicles.length > 0 ? (
                vehicles.map((vehicle, index) => (
                  <Badge key={index} colorScheme="blue" variant="subtle" p={1} borderRadius="md">
                    {vehicle}
                  </Badge>
                ))
              ) : (
                <Text>None</Text>
              )}
            </VStack>
          </Box>
          <Divider />
          <Box>
            <Heading as="h3" size="md" mt={4} mb={2}>
              Starships
            </Heading>
            <VStack align="start">
              {starships.length > 0 ? (
                starships.map((starship, index) => (
                  <Badge key={index} colorScheme="red" variant="subtle" p={1} borderRadius="md">
                    {starship}
                  </Badge>
                ))
              ) : (
                <Text>None</Text>
              )}
            </VStack>
          </Box>
          <Divider />
          <Button as={RouterLink} to="/" mt={4} colorScheme="teal">
            Back to List
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};

export default CharacterDetail;
