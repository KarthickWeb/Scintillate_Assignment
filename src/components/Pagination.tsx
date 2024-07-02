import React from 'react';
import { Box, Button } from '@chakra-ui/react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box display="flex" justifyContent="center" mt="4">
      {pageNumbers.map((number) => (
        <Button
          key={number}
          onClick={() => paginate(number)}
          mx="1"
          isDisabled={number === currentPage}
        >
          {number}
        </Button>
      ))}
    </Box>
  );
};

export default Pagination;
