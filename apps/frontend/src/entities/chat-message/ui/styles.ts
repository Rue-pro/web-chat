import { styled, Typography, Box } from '@mui/material'

export const Container = styled(Box)`
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
  width: calc(100% - 10px);
  padding: 16px;
  background-color: #009ed1;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -6px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 20px solid #009ed1;
  }
`

export const Message = styled(Typography)`
  font-size: 14px;
  line-height: 19px;
  font-weight: 400;
  margin-bottom: 20px;
  word-break: break-word;
`

export const Time = styled(Typography)`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
`
