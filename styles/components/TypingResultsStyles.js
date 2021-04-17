import styled from 'styled-components';

import { Box } from 'rebass';

export const TypingResults = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding-top: 20px;

  ul {
    list-style: none;
    padding: 0;

    li {
      font-size: 20px;
    }

    li:first-child {
      font-size: 40px;
    }
  }
`;

export default TypingResults;