import Head from "next/head"
import { useState, useEffect } from "react"

import MainContainer from "../styles/MainContainer"
import { Box, Card, Flex } from "rebass"
import { Input } from "@rebass/forms"

export default function Home() {
  const [randomWords, setRandomWords] = useState([])
  const [curWordIndex, setCurWordIndex] = useState(0)

  const [curWordBgColor, setCurWordBgColor] = useState("#88ff88")
  const [colorsOfPrevWordsArr, setColorsOfPrevWordsArr] = useState([])
  // const [currentWordArr, setCurrentWordArr] = useState([])

  useEffect(() => {
    async function fetchTextFile() {
      const resp = await fetch("https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears-medium.txt")
      const data = await resp.text()
      return data
    }

    async function textFileToArray() {
      const text = await fetchTextFile()
      const array = text.split(/\n|\r/g)
      return array
    }

    async function getRandomWordsArray(length) {
      const fullArray = await textFileToArray()
      const randomWordsArray = []

      for (let i = 0; i < length; i++) {
        randomWordsArray.push(fullArray[Math.floor(Math.random() * fullArray.length)])
      }

      setRandomWords(randomWordsArray)
    }

    getRandomWordsArray(400)
  }, [])

  // useEffect(() => {
  //   if (randomWords && randomWords[curWordIndex]) {
  //     const wordArr = randomWords[curWordIndex].split("")
  //     setCurrentWordArr(wordArr)
  //   }
  //   console.log("object")
  // }, [randomWords, curWordIndex])

  // useEffect(() => {
  //   let curLetterIndex = 0

  //   function listenKeys(e) {
  //     if (e.key === currentWordArr[curLetterIndex]) {
  //       curLetterIndex = curLetterIndex + 1f
  //     } else {
  //       curLetterIndex = 0
  //       console.log(currentWordArr)
  //       console.log(curLetterIndex)
  //     }
  //     console.log(`${currentWordArr.length} ${curLetterIndex}`)
  //     if (currentWordArr.length === curLetterIndex) {
  //       setCurWordIndex(curWordIndex + 1)
  //     }
  //   }

  //   document.addEventListener("keydown", listenKeys)
  // }, [currentWordArr])

  function listenWords(e) {
    const typedTextArr = e.target.value.split("")
    const currentWordArr = randomWords[curWordIndex].split("")

    const isTypedTextCorrect = (typedText) =>
      typedText.every((value, index) => {
        return value === currentWordArr[index]
      })
    const lastTypedCharIsSpace = () => typedTextArr[typedTextArr.length - 1] === " "
    const isTypedTextCorrectWithSpace = () => isTypedTextCorrect([...typedTextArr].slice(0, -1))
    const isCorrectAmountOfChars = () => typedTextArr.length === currentWordArr.length + 1
    const isArrLengthGreaterThan1 = () => typedTextArr.length > 1

    if (isTypedTextCorrect(typedTextArr)) {
      setCurWordBgColor("#88ff88") // green
    } else if (isCorrectAmountOfChars() && isTypedTextCorrectWithSpace() && lastTypedCharIsSpace()) {
      setCurWordIndex(curWordIndex + 1)
      e.target.value = ""
      setColorsOfPrevWordsArr([...colorsOfPrevWordsArr, "green"])
    } else if (lastTypedCharIsSpace() && isArrLengthGreaterThan1()) {
      setCurWordIndex(curWordIndex + 1)
      e.target.value = ""
      setColorsOfPrevWordsArr([...colorsOfPrevWordsArr, "red"])
    } else if (lastTypedCharIsSpace() && !isArrLengthGreaterThan1()) {
      e.target.value = ""
    } else {
      setCurWordBgColor("#f58989") // red
    }
  }

  return (
    <>
      <Head>
        <title>Type faster!</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MainContainer>
        <Box width={"80%"} maxWidth='900px'>
          {/* {currentWordArr} */}
          <Input onChange={listenWords} id='comment' name='comment' type='text' />
          <Card
            sx={{
              p: 1,
              borderRadius: 2,
              boxShadow: "0 0 16px rgba(0, 0, 0, .25)",
              backgroundColor: "#f3f5f7",
            }}>
            <Flex flexWrap='wrap' space={5} css={{ height: "100px", overflow: "hidden" }}>
              {/* <Box ml={1} my={1} px={2} width={"fit-content"} fontSize='18px' css={{ borderRadius: "5px" }} color='white' bg='#444'>
                {currentWordArr}
              </Box> */}
              {randomWords.map((word, i) => {
                return (
                  <Box
                    key={i}
                    ml={1}
                    my={2}
                    px={1}
                    width={"fit-content"}
                    fontSize='22px'
                    fontWeight={i === curWordIndex ? 700 : 400}
                    css={{ borderRadius: "5px", position: "relative", top: "0px" }}
                    color={i === curWordIndex ? "black" : colorsOfPrevWordsArr.length && colorsOfPrevWordsArr[i] ? colorsOfPrevWordsArr[i] : "black"}
                    bg={i === curWordIndex ? curWordBgColor : "transparent"}>
                    {word}
                  </Box>
                )
              })}
            </Flex>
          </Card>
        </Box>
      </MainContainer>
    </>
  )
}
