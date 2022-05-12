import React from 'react'
import { styled, Badge, Avatar, Stack } from '@mui/material'

export interface AvatarBadgeProps {
  src: string
  alt: string
  isOnline?: boolean
}

const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  src,
  alt,
  isOnline = false,
}) => {
  return (
    <Stack direction="row" spacing={2}>
      {isOnline ? (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot">
          <Avatar alt={alt} src={src} />
        </StyledBadge>
      ) : (
        <Avatar alt={alt} src={src} />
      )}
    </Stack>
  )
}

export default AvatarBadge

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))
