import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { SearchInput } from './style';

function Search({ handleSubmit, handleChange, text, inputRef }) {
  return (
    <form onSubmit={handleSubmit}>
      <SearchInput
        ref={inputRef}
        value={text}
        placeholder="search user..."
        onChange={handleChange}
      />
    </form>
  );
}

Search.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

function SearchContainer(props) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const handleChange = e => {
    const { value } = e.target;
    setText(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.history.push(`/${text}`);
    setText('');
    inputRef.current.blur();
  };

  return (
    <Search
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      text={text}
      inputRef={inputRef}
    />
  );
}

export default withRouter(SearchContainer);
