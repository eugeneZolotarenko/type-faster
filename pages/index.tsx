import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

import { transformTimeToReadable } from 'utils/transformTimeToReadoble';

import MainContainer from 'style/components/MainContainerStyles';
import TypingResults from 'style/components/TypingResultsStyles';
import { Box, Card, Flex, Text } from 'rebass';
import { Input } from '@rebass/forms';

export default function Home() {
  const greenColor = '#88ff88';
  const redColor = '#f58989';

  const initialTypingTestResult = {
    isLastTestExist: false,
    charTyped: 0,
    wordsPerMinute: 0,
    accuracy: 0,
    correctWords: 0,
    wrongWords: 0,
  };
  const [randomWords, setRandomWords] = useState<string[]>([]);
  const [curWordIndex, setCurWordIndex] = useState(0);

  const [curWordBgColor, setCurWordBgColor] = useState(greenColor);
  const [colorsOfPrevWordsArr, setColorsOfPrevWordsArr] = useState<string[]>(
    []
  );

  const [topPositionOfWordsWrapper, setTopPositionOfWordsWrapper] = useState(0);
  const [heightOfVisibleWordsContainer] = useState(100);

  const [typingTestTime] = useState(60);
  const [typingTestTimeLeft, setTypingTestTimeLeft] = useState(typingTestTime);

  const [lastTypingTestResults, setLastTypingTestResults] = useState(
    initialTypingTestResult
  );

  const [curTypingTestResults, setCurTypingTestResults] = useState(
    initialTypingTestResult
  );

  const wrapperOfWordsEl = useRef<HTMLElement>(null);
  const inputForWordsEl = useRef<HTMLInputElement>(null);

  function runTimer() {
    let time = typingTestTimeLeft;

    const timer = setInterval(() => {
      time = time - 1;
      setTypingTestTimeLeft(time);
    }, 1000);

    const timeWithoutOneSecond = typingTestTime * 1000 - 60;

    const debouncer = setTimeout(() => {
      clearInterval(timer);
      resetApp();
    }, timeWithoutOneSecond);

    return () => clearTimeout(debouncer);
  }

  function resetApp() {
    getRandomWordsArray(400).then(() => {
      setTypingTestTimeLeft(60);
      setCurWordIndex(0);
      setColorsOfPrevWordsArr([]);
      setCurWordBgColor(greenColor);
      setTopPositionOfWordsWrapper(0);
      emptyInput();
      deactivateTypingTestInput();
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

  async function getRandomWordsArray(length: number) {
    const fullArray = await textFileToArray();
    const randomWordsArray = [];

    for (let i = 0; i < length; i++) {
      randomWordsArray.push(
        fullArray[Math.floor(Math.random() * fullArray.length)]
      );
    }

    setRandomWords(filterArrayFromEmptyStrings(randomWordsArray));
  }

  function filterArrayFromEmptyStrings(arr: string[]) {
    return arr.filter((item) => item !== ' ');
  }

  function activateTypingTestInput() {
    inputForWordsEl.current?.focus();
  }

  function deactivateTypingTestInput() {
    inputForWordsEl.current?.blur();
  }

  function emptyInput() {
    inputForWordsEl.current!.value = '';
  }

  const getPositionOfNextWordEl = () => {
    const allWordsEls:
      | NodeListOf<HTMLElement>
      | undefined = wrapperOfWordsEl.current?.querySelectorAll('.word');
    if (allWordsEls) {
      const nextWordEl = allWordsEls[curWordIndex + 1];
      const posOfNextWordEl = nextWordEl.offsetLeft;
      return posOfNextWordEl;
    }
  };

  function listenTypingTest(e: React.FormEvent<HTMLInputElement>) {
    const typedTextArr = e.currentTarget.value.split('');
    const currentWordArr = randomWords[curWordIndex].split('');
    const positionOfNextWordEl = getPositionOfNextWordEl();

    const isCurWordLastInTheRow = () =>
      positionOfNextWordEl && positionOfNextWordEl <= 30;
    const isItStartOfTypingTest = () =>
      curWordIndex === 0 && typedTextArr.length === 1;
    const lastTypedCharIsSpace = () =>
      typedTextArr[typedTextArr.length - 1] === ' ';
    const isTypedTextCorrect = (typedText: string[]) =>
      typedText.every((value, index) => value === currentWordArr[index]);
    const isTypedTextCorrectWithSpace = () =>
      isTypedTextCorrect([...typedTextArr].slice(0, -1));
    const isCorrectAmountOfCharsWithSpace = () =>
      typedTextArr.length === currentWordArr.length + 1;
    const isTypedLettersGreaterThan1 = () => typedTextArr.length > 1;
    const isTypedTextArrEmpty = (typedText: string[]) => typedText.length === 0;

    const recountTopPositionOfWordsWrapper = () =>
      topPositionOfWordsWrapper + heightOfVisibleWordsContainer / 2;
    const emtyTypedTextArr = () => (typedTextArr.length = 0);

    if (isItStartOfTypingTest()) {
      runTimer();
    }

    if (lastTypedCharIsSpace() && isTypedLettersGreaterThan1()) {
      setCurWordIndex(curWordIndex + 1);
      e.currentTarget.value = '';
      if (isCurWordLastInTheRow()) {
        setTopPositionOfWordsWrapper(recountTopPositionOfWordsWrapper());
      }

      if (isCorrectAmountOfCharsWithSpace() && isTypedTextCorrectWithSpace()) {
        const correctWords = curTypingTestResults.correctWords + 1;
        const charTyped = curTypingTestResults.charTyped + typedTextArr.length;
        const wordsPerMinute = charTyped / 5 / (typingTestTime / 60);

        setColorsOfPrevWordsArr([...colorsOfPrevWordsArr, 'green']);
        setCurTypingTestResults({
          ...curTypingTestResults,
          correctWords,
          charTyped,
          wordsPerMinute,
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
      e.currentTarget.value = '';
    }

    if (isTypedTextCorrect(typedTextArr) || isTypedTextArrEmpty(typedTextArr)) {
      setCurWordBgColor(greenColor);
    } else {
      setCurWordBgColor(redColor);
    }
  }

  useEffect(() => {
    if (curWordIndex === 0) {
      setLastTypingTestResults(curTypingTestResults);
      setCurTypingTestResults(initialTypingTestResult);
    }
  }, [curWordIndex]);

  useEffect(() => {
    console.log(curTypingTestResults);
  }, [curTypingTestResults]);

  useEffect(() => {
    getRandomWordsArray(400);
    activateTypingTestInput();
  }, []);

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
            <Flex fontSize="20px" flexDirection="column" alignItems="center">
              <Text fontSize="30px">
                {lastTypingTestResults.wordsPerMinute} WPM
              </Text>
              <Text>
                Keystrokes: <span>correct: 192</span> | <span>wrong: 5</span> |{' '}
                <span>summary: 197</span>
              </Text>
              <Text>Accuracy: 96%</Text>
              <Text>Correct words: {lastTypingTestResults.correctWords}</Text>
              <Text>Wrong words: {lastTypingTestResults.wrongWords}</Text>
            </Flex>
          </TypingResults>
        </Box>
      </MainContainer>
    </>
  );
}