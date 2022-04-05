import React, { ReactElement } from 'react'
import { Grid, Stack } from '@mui/material'

type TemplateProps = {
  avatar: ReactElement
  title: ReactElement
  message: ReactElement
  info: ReactElement
}

const Template: React.FC<TemplateProps> = ({
  avatar,
  title,
  message,
  info,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={1} md={2}>
        {avatar}
      </Grid>
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
}

export default Template
