import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

import MainContainer from 'styles/components/MainContainerStyles';
import TypingResults from 'styles/components/TypingResultsStyles';
import { Box, Card, Flex } from 'rebass';
import { Input } from '@rebass/forms';

import { transformTimeToReadable } from 'utils/transformTimeToReadoble';

export default function Home() {
  const [randomWords, setRandomWords] = useState([]);
  const [curWordIndex, setCurWordIndex] = useState(0);

  const [curWordBgColor, setCurWordBgColor] = useState('#88ff88');
  const [colorsOfPrevWordsArr, setColorsOfPrevWordsArr] = useState([]);

  const [topPositionOfWordsWrapper, setTopPositionOfWordsWrapper] = useState(0);
  const [heightOfVisibleWordsContainer] = useState(100);

  const [typingTestTime] = useState(60);
  const [typingTestTimeLeft, setTypingTestTimeLeft] = useState(typingTestTime);

  const [lastTypingTestResults, setLastTypingTestResults] = useState({
    isLastTestExist: false,
    charTyped: 0,
    wordsPerMinute: 0,
    accuracy: 0,
    correctWords: 0,
    wrongWords: 0,
  });

  const [curTypingTestResults, setCurTypingTestResults] = useState({
    isLastTestExist: true,
    charTyped: 0,
    wordsPerMinute: 0,
    accuracy: 0,
    correctWords: 0,
    wrongWords: 0,
  });

  const wrapperOfWordsEl = useRef(null);
  const inputForWordsEl = useRef(null);

  function runTimer() {
    let time = typingTestTimeLeft;

    const timer = setInterval(() => {
      time = time - 1;
      setTypingTestTimeLeft(time);
    }, 1000);

    const timeWithoutOneSecond = typingTestTime * 1000 - 60;

    setTimeout(() => {
      clearInterval(timer);
      resetApp();
    }, timeWithoutOneSecond);
  }

  function resetApp() {
    getRandomWordsArray(400).then(() => {
      setTypingTestTimeLeft(60);
      setCurWordIndex(0);
      setColorsOfPrevWordsArr([]);
      setCurWordBgColor('#88ff88');
      setTopPositionOfWordsWrapper(0);
      emptyInput();
      deactivateTypingTestInput();
    });
  }

  function countResults() {
    const wordsPerMinute = curTypingTestResults / 5 / 1;

    setCurTypingTestResults({
      ...curTypingTestResults,
      wordsPerMinute,
    });
  }

  async function fetchTextFile() {
    const resp = await fetch(
      'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears-medium.txt'
    );
    const data = await resp.text();
    return data;
  }

  async function textFileToArray() {
    const text = await fetchTextFile();
    const arrayOfWordsFromText = text.split(/\n|\r/g);
    return arrayOfWordsFromText;
  }

  async function getRandomWordsArray(length) {
    const fullArray = await textFileToArray();
    const randomWordsArray = [];

    for (let i = 0; i < length; i++) {
      randomWordsArray.push(
        fullArray[Math.floor(Math.random() * fullArray.length)]
      );
    }

    setRandomWords(filterArrayFromEmptyStrings(randomWordsArray));
  }

  function filterArrayFromEmptyStrings(arr) {
    return arr.filter((item) => item !== ' ');
  }

  useEffect(() => {
    getRandomWordsArray(400);
    activateTypingTestInput();
  }, []);

  function activateTypingTestInput() {
    inputForWordsEl.current.focus();
  }

  function deactivateTypingTestInput() {
    inputForWordsEl.current.blur();
  }

  function emptyInput() {
    inputForWordsEl.current.value = '';
  }

  const getPositionOfNextWordEl = () => {
    const allWordsEls = wrapperOfWordsEl.current.querySelectorAll('.word');
    const nextWordEl = allWordsEls[curWordIndex + 1];
    const posOfNextWordEl = nextWordEl.offsetLeft;
    return posOfNextWordEl;
  };

  function listenTypingTest(e) {
    const typedTextArr = e.target.value.split('');
    const currentWordArr = randomWords[curWordIndex].split('');

    const isCurWordLastInTheRow = () => getPositionOfNextWordEl() <= 30;
    const isItStartOfTypingTest = () =>
      curWordIndex === 0 && typedTextArr.length === 1;
    const lastTypedCharIsSpace = () =>
      typedTextArr[typedTextArr.length - 1] === ' ';
    const isTypedTextCorrect = (typedText) =>
      typedText.every((value, index) => value === currentWordArr[index]);
    const isTypedTextCorrectWithSpace = () =>
      isTypedTextCorrect([...typedTextArr].slice(0, -1));
    const isCorrectAmountOfCharsWithSpace = () =>
      typedTextArr.length === currentWordArr.length + 1;
    const isTypedLettersGreaterThan1 = () => typedTextArr.length > 1;
    const isTypedTextArrEmpty = (typedText) => typedText.length === 0;

    const recountTopPositionOfWordsWrapper = () =>
      topPositionOfWordsWrapper + heightOfVisibleWordsContainer / 2;
    const emtyTypedTextArr = () => (typedTextArr.length = 0);

    if (isItStartOfTypingTest()) {
      runTimer();
    }

    if (lastTypedCharIsSpace() && isTypedLettersGreaterThan1()) {
      setCurWordIndex(curWordIndex + 1);
      e.target.value = '';
      if (isCurWordLastInTheRow()) {
        setTopPositionOfWordsWrapper(recountTopPositionOfWordsWrapper());
      }

      if (isCorrectAmountOfCharsWithSpace() && isTypedTextCorrectWithSpace()) {
        setColorsOfPrevWordsArr([...colorsOfPrevWordsArr, 'green']);
        setCurTypingTestResults({
          ...curTypingTestResults,
          correctWords: curTypingTestResults.correctWords + 1,
          charTyped: curTypingTestResults.charTyped + typedTextArr.length,
        });
      } else {
        setColorsOfPrevWordsArr([...colorsOfPrevWordsArr, 'red']);
        setCurTypingTestResults({
          ...curTypingTestResults,
          wrongWords: curTypingTestResults.wrongWords + 1,
        });
      }

      emtyTypedTextArr();
    } else if (lastTypedCharIsSpace() && !isTypedLettersGreaterThan1()) {
      e.target.value = '';
    }

    if (isTypedTextCorrect(typedTextArr) || isTypedTextArrEmpty(typedTextArr)) {
      setCurWordBgColor('#88ff88'); // green
    } else {
      setCurWordBgColor('#f58989'); // red
    }
  }

  useEffect(() => {
    console.log(curTypingTestResults);
  }, [curTypingTestResults]);

  return (
    <>
      <Head>
        <title>Type faster!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MainContainer>
        <Box width={'80%'} maxWidth="900px">
          <Flex>
            <Input
              ref={inputForWordsEl}
              autocomplete="off"
              onChange={listenTypingTest}
              type="text"
            />
            <Flex
              alignItems="center"
              justifyContent="center"
              className="count-down-timer"
              px={2}
              ml={2}
              fontSize="22px"
            >
              {transformTimeToReadable(typingTestTimeLeft)}
            </Flex>
          </Flex>
          <Card
            sx={{
              p: 1,
              borderRadius: 2,
              boxShadow: '0 0 16px rgba(0, 0, 0, .2)',
              backgroundColor: '#f3f5f7',
            }}
            my={3}
            css={{
              height: `${heightOfVisibleWordsContainer}px`,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Flex
              ref={wrapperOfWordsEl}
              flexWrap="wrap"
              space={5}
              css={{
                position: 'relative',
                top: `-${topPositionOfWordsWrapper}px`,
              }}
            >
              {randomWords.map((word, i) => {
                return (
                  <Box
                    key={i}
                    ml={1}
                    my={2}
                    px={1}
                    width={'fit-content'}
                    fontSize="22px"
                    fontWeight="500"
                    css={{ borderRadius: '5px' }}
                    className="word"
                    color={
                      i === curWordIndex
                        ? 'black'
                        : colorsOfPrevWordsArr.length && colorsOfPrevWordsArr[i]
                        ? colorsOfPrevWordsArr[i]
                        : 'black'
                    }
                    bg={i === curWordIndex ? curWordBgColor : 'transparent'}
                  >
                    {word}
                  </Box>
                );
              })}
            </Flex>
          </Card>
          <TypingResults>
            <h3>Your last results are:</h3>
            <ul>
              <li>38 WPM</li>
              <li>Accuracy: 96%</li>
              <li>Correct words: 100</li>
              <li>Wrong words: 3</li>
            </ul>
          </TypingResults>
        </Box>
      </MainContainer>
    </>
  );
}
