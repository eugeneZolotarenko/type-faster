import Head from "next/head"

import MainContainer from "../styles/MainContainer"
import { Box, Card, Flex } from "rebass"

export default function Home() {
  return (
    <>
      <Head>
        <title>Type faster!</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MainContainer>
        <Box width={"80%"} maxWidth='600px'>
          <Card
            sx={{
              p: 1,
              borderRadius: 2,
              boxShadow: "0 0 16px rgba(0, 0, 0, .25)",
              backgroundColor: "#f3f5f7",
              msxWidth: "500px",
            }}>
            <Flex flexWrap='wrap' space={5}>
              <Box ml='5px' px={2} width={"fit-content"} fontSize='18px' css={{ borderRadius: "5px" }} color='black' bg='transparent'>
                Flex
              </Box>
              <Box ml='5px' px={2} width={"fit-content"} fontSize='18px' css={{ borderRadius: "5px" }} color='white' bg='black'>
                FlexFlex
              </Box>
            </Flex>
          </Card>
        </Box>
      </MainContainer>
    </>
  )
}
