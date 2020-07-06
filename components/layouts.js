import styled from 'styled-components';
import media from 'styled-media-query';

const mobile = media.lessThan('small');
const desktop = media.greaterThan('small');

export const Container = styled.div`
  text-align: center;
  height: 100vh;

  ${desktop`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > div {
      width: 500px;
    }
  `};
  ${mobile`
    padding: 40px 10px;
  `};
`;

export const Button = styled.a`
  cursor: pointer;
  display: inline-block;
  margin: 10px 0;
  padding: 8px 12px;
  color: #e3e3e3;
  background: ${({ theme: { linkBase } }) => linkBase};

  :hover {
    text-decoration: none;
  }
`;
