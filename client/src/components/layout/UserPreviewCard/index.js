import styled from 'styled-components';

import Background from './background';
import HeaderMenu from './headerMenu';
import MidFlex from './midFlex';
import StatsContainer from './statsContainer';

const UserPreviewCard = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.3);
`;

UserPreviewCard.Background = Background;
UserPreviewCard.HeaderMenu = HeaderMenu;
UserPreviewCard.MidFlex = MidFlex;
UserPreviewCard.StatsContainer = StatsContainer;

export default UserPreviewCard;
