import React from 'react';
import { ChakraProvider, FormControl, FormLabel, FormErrorMessage, Button } from '@chakra-ui/react';

const CustomInput = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ padding: '8px', margin: '4px' }}
    />
  );
};

const MyForm = () => {
  const [inputValue, setInputValue] = React.useState('');
  const [error, setError] = React.useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    // Perform validation
    if (!inputValue.trim()) {
      setError('Field is required');
    } else {
      setError('');
      // Perform form submission logic here
    }
  };

  return (
    <ChakraProvider>
      <FormControl isInvalid={!!error}>
        <FormLabel htmlFor="myInput">My Field</FormLabel>
        <CustomInput
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type something"
        />
        <FormErrorMessage>{error}</FormErrorMessage>
        <Button onClick={handleSubmit} mt={4} colorScheme="teal">
          Submit
        </Button>
      </FormControl>
    </ChakraProvider>
  );
};

export default MyForm;
