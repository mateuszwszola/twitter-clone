import { createGlobalStyle } from 'styled-components/macro';

const GlobalStyle = createGlobalStyle`
  html,
  body,
  #root,
  .wrapper {
    height: 100%;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
    text-decoration: inherit;
  }

  ul,
  ol {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  body {
    margin: 0;
    font-size: 14px;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      s Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: ${(props) => props.theme.colors.black};
  }
`;

export default GlobalStyle;
