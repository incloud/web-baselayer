import { createGlobalStyle } from './theme';

export const GlobalStyle = createGlobalStyle`
  .col-xs-mb-1 {
    @media (min-width: ${({ theme }) => theme.screenXs}) {
      margin-bottom: 1em;
    }
  }

  .col-xxl-mb-0 {
    @media (min-width: ${({ theme }) => theme.screenXxl}) {
      margin-bottom: 0;
    }
  }
`;
