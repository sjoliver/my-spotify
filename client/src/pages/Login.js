import styled from 'styled-components/macro';
import React from 'react';

const StyledLoginContainer = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledLoginButton = styled.a`
  display: inline-block;
  background-color: var(--green);
  color: var(--black);
  border-radius: var(--border-radius-pill);
  font-weight: 700;
  font-size: var(--fz-xxl);
  padding: var(--spacing-sm) var(--spacing-xl);

  &:hover,
  &:focus {
    text-decoration: none;
    filter: brightness(1.1);
  }
`;

const Login = () => (
  <StyledLoginContainer>
    <StyledLoginButton href="https://spotify-playlist-analytics.herokuapp.com/login">
      Log in to Spotify
    </StyledLoginButton>
  </StyledLoginContainer>
);

export default Login;