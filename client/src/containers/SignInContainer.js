import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from 'actions/authActions';
import { clearErrors } from 'actions/errorActions';
import SignIn from 'components/SignIn';
import validateForm from 'utils/validateForm';
import isEmpty from 'utils/isEmpty';
import useFormInput from 'hooks/useFormInput';

function SignInContainer(props) {
    const username = useFormInput('');
    const password = useFormInput('');
    const [errors, setErrors] = useState([]);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (props.auth.isAuthenticated || !isEmpty(props.errors)) {
            setRedirect(props.auth.isAuthenticated);
            setErrors(!isEmpty(props.errors) && props.errors);
        }
    }, [props.auth.isAuthenticated, props.errors]);

    useEffect(() => props.clearErrors(), []);

    const handleSubmit = e => {
        e.preventDefault();
        const userData = { username: username.value, password: password.value };
        const errors = validateForm(userData);
        if (errors) {
            setErrors(errors);
        } else {
            props.loginUser(userData);
        }
    };

    if (redirect) {
        const { from } = props.location.state || { from: { pathname: '/' } };
        return <Redirect to={from} />;
    }

    return (
        <SignIn
            username={username}
            password={password}
            onSubmit={handleSubmit}
            errors={errors}
        />
    );
}

SignInContainer.propTypes = {
    loginUser: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.array.isRequired
};

const mapStateToProps = ({ auth, errors }) => ({
    auth,
    errors
});

export default connect(
    mapStateToProps,
    { loginUser, clearErrors }
)(SignInContainer);