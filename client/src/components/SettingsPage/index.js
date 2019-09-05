import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Container, ActionsContainer, Form, ChangePasswordButton, EditProfileButton, DeleteAccountButton  } from "./style";
import InputGroup from "components/InputGroup";

function SettingsPage({ password, password2 }) {
    return (
        <Container>
            <h1>Settings</h1>
            <Form>
                <label>
                    Current password:
                    <InputGroup
                        type="password"
                        name="password"
                        {...password}
                        placeholder="Password"
                        error={false}
                        errorMsg=''
                    />
                </label>
                <label>
                    New password:
                    <InputGroup
                        type="password"
                        name="password2"
                        {...password2}
                        placeholder="Repeat password"
                        error={false}
                        errorMsg={''}
                    />
                </label>
                <ChangePasswordButton primary>Change password</ChangePasswordButton>
            </Form>
            <ActionsContainer>
                <EditProfileButton as={Link} to="/edit-profile">Edit profile</EditProfileButton>
                <DeleteAccountButton>Delete Account</DeleteAccountButton>
            </ActionsContainer>
        </Container>
    )
}

export default SettingsPage;