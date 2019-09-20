import React from 'react';
import { StyledProfilesList } from './style';

function ProfilesList(props) {
    return (
        <StyledProfilesList>
            {props.children}
        </StyledProfilesList>
    )
}

export default ProfilesList;