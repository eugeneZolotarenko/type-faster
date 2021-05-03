import React from 'react';
import { Helmet } from 'react-helmet';

import { ChakraProvider } from '@chakra-ui/react';
import { theme } from 'style/theme';

function MyApp({ Component, pageProps }: any) {
  return (
    <ChakraProvider theme={theme} resetCSS={true}>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap"
        />
      </Helmet>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
