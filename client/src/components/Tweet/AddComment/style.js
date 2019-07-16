import styled from 'styled-components/macro';
import { Input } from 'shared/components';

export const CommentContainer = styled.div`
  background-color: #f6f8fa;
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
  align-items: center;
  padding: 10px 40px;
  border-top: 1px solid #cadae4;
  border-bottom: 1px solid #cadae4;
`;

export const CommentForm = styled.form`
  flex: 1;
`;

export const CommentInput = styled(Input)`
  height: 35px;
  flex: 1;
  border-radius: 5px;
`;
