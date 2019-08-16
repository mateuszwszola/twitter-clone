import styled from 'styled-components/macro';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #eee;
`;

export const BackgroundContainer = styled.div`
  height: 250px;
  background: #29a3ef;
  overflow: hidden;
`;

export const Background = styled.img`
  max-width: 100%;
  height: 100%;
`;

export const ProfileTweetsBoard = styled.div`
  padding: 7px 12px;
  margin-bottom: 10px;
`;

export const Sidebar = styled.div``;

export const ProfileList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  background-color: #fff;
`;
