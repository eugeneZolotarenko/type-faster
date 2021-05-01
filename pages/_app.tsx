import GlobalStyles from '../style/ResetStyles';

function MyApp({ Component, pageProps }: any) {
  return (
    <>
      <GlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
