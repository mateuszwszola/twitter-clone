import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container, StyledAlert } from './style';

function Alert({ alerts }) {
  return alerts !== null && alerts.length > 0 ? (
      <Container>
          {alerts.map(alert => (
            <StyledAlert key={alert.id} type={alert.alertType}>
              {alert.msg}
            </StyledAlert>
          ))} 
      </Container>
  ) : null;
}

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = ({ alert }) => ({
  alerts: alert
});

export default connect(mapStateToProps)(Alert);