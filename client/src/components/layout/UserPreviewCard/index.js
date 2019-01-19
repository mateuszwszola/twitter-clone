import styled from 'styled-components';

import Background from './Background';
import HeaderMenu from './HeaderMenu';
import MidFlex from './MidFlex';
import StatsContainer from './StatsContainer';

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
