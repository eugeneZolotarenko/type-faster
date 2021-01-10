import Head from "next/head"
import { useState, useEffect, useRef } from "react"

import MainContainer from "../styles/MainContainer"
import { Box, Card, Flex } from "rebass"
import { Input } from "@rebass/forms"

export default function Home() {
  const [randomWords, setRandomWords] = useState([])
  const [curWordIndex, setCurWordIndex] = useState(0)

  const [curWordBgColor, setCurWordBgColor] = useState("#88ff88")
  const [colorsOfPrevWordsArr, setColorsOfPrevWordsArr] = useState([])

  const [topPositionOfWordsWrapper, setTopPositionOfWordsWrapper] = useState(0)
  const [heightOfVisibleWordsContainer] = useState(100)

  const [typeTestTime] = useState(60)
  const [timeLeft, setTimeLeft] = useState(typeTestTime);

  const wrapperOfWordsEl = useRef(null);
  const inputForWordsEl = useRef(null);

  function runTimer() {
    let time = timeLeft

    const timer = setInterval(() => {
      time = time - 1
      setTimeLeft(time);
    }, 1000);

    const timeWithoutOneSecond = (typeTestTime * 1000) - 60

    setTimeout(() => {
      clearInterval(timer)
      resetApp()
    }, timeWithoutOneSecond);
  }

  function resetApp() {
    getRandomWordsArray(400)
    setTimeLeft(60)
    setCurWordIndex(0)
    setColorsOfPrevWordsArr([])
    setCurWordBgColor("#88ff88")
    setTopPositionOfWordsWrapper(0)
    emptyInput()
    deactivateTypingTestInput()
  }

  async function fetchTextFile() {
    const resp = await fetch("https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears-medium.txt")
    const data = await resp.text()
    return data
  }

  async function textFileToArray() {
    const text = await fetchTextFile()
    const arrayOfWordsFromText = text.split(/\n|\r/g)
    return arrayOfWordsFromText
  }

  async function getRandomWordsArray(length) {
    const fullArray = await textFileToArray()
    const randomWordsArray = []

    for (let i = 0; i < length; i++) {
      randomWordsArray.push(fullArray[Math.floor(Math.random() * fullArray.length)])
    }
    console.log(randomWordsArray)
    setRandomWords(randomWordsArray)
  }

  useEffect(() => {
    getRandomWordsArray(400)
    activateTypingTestInput()
  }, [])

  function activateTypingTestInput() {
    inputForWordsEl.current.focus()
  }

  function deactivateTypingTestInput() {
    inputForWordsEl.current.blur()
  }

  function emptyInput() {
    inputForWordsEl.current.value = ""
  }

  const getPositionOfNextWordEl = () => {
    const allWordsEls = wrapperOfWordsEl.current.querySelectorAll('.word')
    const nextWordEl = allWordsEls[curWordIndex + 1]
    const posOfNextWordEl = nextWordEl.offsetLeft
    return posOfNextWordEl
  }

  const curWordIsLastInTheRow = () => getPositionOfNextWordEl() <= 30

  function listenTypingTest(e) {
    const typedTextArr = e.target.value.split("")
    const currentWordArr = randomWords[curWordIndex].split("")

    const isItStartOfTypingTest = () => curWordIndex === 0 && typedTextArr.length === 1

    const lastTypedCharIsSpace = () => typedTextArr[typedTextArr.length - 1] === " "
    const isTypedTextCorrectWithSpace = () => isTypedTextCorrect([...typedTextArr].slice(0, -1))
    const isCorrectAmountOfChars = () => typedTextArr.length === currentWordArr.length + 1
    const isTypedLettersGreaterThan1 = () => typedTextArr.length > 1

    const isTypedTextCorrect = (typedText) =>
    typedText.every((value, index) => value === currentWordArr[index])

    if (isTypedTextCorrect(typedTextArr)) {
      setCurWordBgColor("#88ff88") // green
      console.log('thats run')
      if (isItStartOfTypingTest()) {
        runTimer()
      }
    } else if (isCorrectAmountOfChars() && isTypedTextCorrectWithSpace() && lastTypedCharIsSpace()) {
      setCurWordIndex(curWordIndex + 1)
      e.target.value = ""
      if (curWordIsLastInTheRow()) {
        setTopPositionOfWordsWrapper(topPositionOfWordsWrapper + (heightOfVisibleWordsContainer / 2))
      }
      setColorsOfPrevWordsArr([...colorsOfPrevWordsArr, "green"])
    } else if (lastTypedCharIsSpace() && isTypedLettersGreaterThan1()) {
      setCurWordIndex(curWordIndex + 1)
      e.target.value = ""
      setColorsOfPrevWordsArr([...colorsOfPrevWordsArr, "red"])
      if (curWordIsLastInTheRow()) {
        setTopPositionOfWordsWrapper(topPositionOfWordsWrapper + (heightOfVisibleWordsContainer / 2))
      }
    } else if (lastTypedCharIsSpace() && !isTypedLettersGreaterThan1()) {
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
          <Flex>
            <Input ref={inputForWordsEl} autocomplete="off" onChange={listenTypingTest} type='text' />
            <Flex alignItems="center" justifyContent="center" className="count-down-timer" px={2} ml={2} fontSize='22px'>{timeLeft === 60 ? '1:00' : `0:${timeLeft}`}</Flex>
          </Flex>
          <Card
            sx={{
              p: 1,
              borderRadius: 2,
              boxShadow: "0 0 16px rgba(0, 0, 0, .25)",
              backgroundColor: "#f3f5f7",
            }}
            css={{ height: `${heightOfVisibleWordsContainer}px`, overflow: "hidden", position: "relative" }}
            >
            <Flex ref={wrapperOfWordsEl} flexWrap='wrap' space={5} css={{ position: "relative", top: `-${topPositionOfWordsWrapper}px` }}>
              {randomWords.map((word, i) => {
                return (
                  <Box
                    key={i}
                    ml={1}
                    my={2}
                    px={1}
                    width={"fit-content"}
                    fontSize='22px'
                    fontWeight='500'
                    css={{ borderRadius: "5px" }}
                    className="word"
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
