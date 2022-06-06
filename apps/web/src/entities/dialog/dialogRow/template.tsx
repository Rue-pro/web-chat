import React, { ReactElement } from 'react'
import { Grid, Stack, styled } from '@mui/material'

interface Props {
  avatar: ReactElement
  title: ReactElement
  message: ReactElement
  info: ReactElement
}

const Template: React.FC<Props> = ({ avatar, title, message, info }) => (
  <Grid container spacing={2}>
    <AvatarContainer item xs={1} md={2}>
      {avatar}
    </AvatarContainer>
    <Grid item xs={9} md={8}>
      {title}
      {message}
    </Grid>
    <Grid item xs={2}>
      <Stack
        alignItems="flex-end"
        justifyContent="space-between"
        sx={{ height: '100%' }}>
        {info}
      </Stack>
    </Grid>
  </Grid>
)

export default Template

const AvatarContainer = styled(Grid)`
  display: flex;
  align-items: center;
`
