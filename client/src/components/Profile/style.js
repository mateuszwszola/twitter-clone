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
  position: relative;
`;

export const AddBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
  font-weight: 200;
  color: #fff;
`;

export const AddBackgroundButton = styled.i`
  cursor: pointer;
`;

export const Background = styled.img`
  object-fit: cover;
  width: 100%;
  max-width: 100%;
  height: 100%;
`;

export const ProfileTweetsBoard = styled.div`
  padding: 7px 12px;
  margin-bottom: 10px;
`;

export const Sidebar = styled.div``;

export const StyledProfilesList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  background-color: #fff;
`;

export const PagesContainer = styled.div`
  background-color: #fff;
  width: 100%;
  padding: 30px 15px;
`;