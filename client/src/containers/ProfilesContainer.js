import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getProfiles } from 'actions/profileActions';
import Profiles from 'components/Profiles';

function ProfilesContainer({ profile, getProfiles }) {
    useEffect(() => {
        getProfiles();
    }, []);

    return (
        <Profiles profile={profile} />
    )
}

ProfilesContainer.propTypes = {
    profile: PropTypes.object.isRequired,
    getProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(ProfilesContainer);