import React, { useCallback, useState } from 'react'
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Modal,
  Box,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

interface TemplateProps {
  aside: React.ReactNode
  title: string
  main: React.ReactNode
}

const Template: React.FC<TemplateProps> = ({ aside, title, main }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <MuiAppBar sx={{ position: 'static' }}>
        <Toolbar>
          {!open && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open aside"
              onClick={handleOpen}
              sx={{
                marginRight: '16px',
              }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </MuiAppBar>
      <Modal open={open} onClose={handleClose}>
        <Paper elevation={0} square sx={{ height: '100vh', width: '30%' }}>
          {aside}
        </Paper>
      </Modal>
      <Box sx={{ height: 'calc(100vh - 63.99px)', width: '100%' }}>{main}</Box>
    </>
  )
}

export default Template
