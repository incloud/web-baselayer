import React, { FC } from 'react';
import styled from 'styled-components';

const FormErrorList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;
const FormErrorListItem = styled.li``;

const FormErrorContainer = styled.div`
  padding: 2rem;
  margin: 1rem;
  background-color: ${props => props.theme.errorColor};
`;

interface IFormErrorProps {
  formErrors: string[];
}

export const FormError: FC<IFormErrorProps> = ({ formErrors }) => {
  return (
    <FormErrorContainer>
      <FormErrorList>
        {formErrors.map((error, idx) => {
          return <FormErrorListItem key={idx}>{error}</FormErrorListItem>;
        })}
      </FormErrorList>
    </FormErrorContainer>
  );
};
