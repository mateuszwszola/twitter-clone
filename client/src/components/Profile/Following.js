import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getProfileFollowingProfiles } from 'actions/profileActions';
import { connect } from 'react-redux';
import Loading from '../Loading';

const Following = ({
    profile: { profile, profiles, loading },
    getProfileFollowingProfiles
                   }) => {
    useEffect(() => {
        getProfileFollowingProfiles(profile.user._id);
    }, [getProfileFollowingProfiles, profile.user._id]);
    return (
        <>
            {loading ? <Loading /> : (
                <>
                    {JSON.stringify(profiles)}
                </>
            )}
        </>
    )
};

Following.propTypes = {
    profile: PropTypes.object.isRequired,
    getProfileFollowingProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps, { getProfileFollowingProfiles })(Following);
