import styled, { createGlobalStyle } from "styled-components";
import BGImage from "./images/suelee.jpg";

export const GlobalStyle = createGlobalStyle`
    html {
        height: 100%,
    }

    body {
        background-image: url(${BGImage});
        background-size: cover;
        margin: 0;
        padding: 0 20px;
        display: flex;
        justify-content: center;
    }

    * {
        box-sizing: border-box;
        font-family: 'Catamaran', sans-serif;
    }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > p {
    color: #fff;
  }

  .score {
    color: #fff;
    font-size: 2rem;
    margin: 0;
  }

  //   h1 {
  //       font-
  //   }
`;

// export const styles = StyleSheet{
//     h1 {
//         font-family:
//     }
// }
