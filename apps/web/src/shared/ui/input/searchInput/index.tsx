import React, { useRef, useEffect, ChangeEvent } from 'react'
import {
  IconButton,
  InputBase,
  InputBaseProps,
  Paper,
  styled,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { colors } from 'shared/theme/colors'
import { borderRadius } from 'shared/theme/common'

type Props = InputBaseProps & {
  debounceTimeout?: number
}

const SearchInput: React.FC<Props> = ({
  placeholder,
  debounceTimeout,
  onChange,
  ...rest
}) => {
  console.log('SearchInput', rest)
  const timer = useRef<NodeJS.Timeout>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (onChange) onChange(e)
    }, debounceTimeout)
  }

  useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  })

  return (
    <Container>
      <Input
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        onChange={handleChange}
        {...rest}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Container>
  )
}

export default SearchInput

const Container = styled(Paper)`
  display: flex;
  align-items: center;
  border-radius: ${`${borderRadius[0]}px`};
  background-color: ${colors.gray[1]};
  box-shadow: none;
`

const Input = styled(InputBase)`
  & input {
    padding-left: 12px;
    padding-right: 12px;
  }
  & .MuiInputLabel-root {
    max-width: calc(100% - 24px);
    left: 10px;
  }
`
