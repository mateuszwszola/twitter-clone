import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyledAlert } from './style';

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <StyledAlert key={alert.id} type={alert.alertType}>
      {alert.msg}
    </StyledAlert>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = ({ alert }) => ({
  alerts: alert
});

export default connect(mapStateToProps)(Alert);
