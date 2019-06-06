import * as styledComponents from 'styled-components';
import * as variables from './variables';

type Theme = typeof variables;
const theme: Theme = variables;

const {
  default: styled,
  createGlobalStyle,
  css,
  keyframes,
  ThemeProvider,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<Theme>;

export { styled, css, keyframes, ThemeProvider, createGlobalStyle, theme };
