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

    const isAuthenticated = props.auth.isAuthenticated;
    const reduxErrors = props.errors;
    const { clearErrors } = props;

    useEffect(() => {
        if (isAuthenticated || !isEmpty(reduxErrors)) {
            setRedirect(isAuthenticated);
            if (!isEmpty(reduxErrors)) {
                setErrors(reduxErrors);
            }
        }
    }, [isAuthenticated, reduxErrors]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => clearErrors(), []);

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