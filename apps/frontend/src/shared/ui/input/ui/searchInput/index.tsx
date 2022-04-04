import React, { useRef, useEffect, ChangeEvent } from 'react'
import { IconButton, InputBase, InputBaseProps, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

type SearchInputProps = InputBaseProps & {
  debounceTimeout?: number
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  debounceTimeout,
  onChange,
  ...rest
}) => {
  const timer = useRef<any>()

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
    <Paper component="form" sx={{ display: 'flex', alignItems: 'center' }}>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        onChange={handleChange}
        {...rest}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  )
}

export default SearchInput
