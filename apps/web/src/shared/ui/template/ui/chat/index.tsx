import React, { useCallback, useState } from 'react'
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Typography,
  Paper,
  Modal,
  Box,
  styled,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { theme } from 'shared/theme/theme'
import { colors } from 'shared/theme/colors'

interface TemplateProps {
  aside: React.ReactNode
  title: string
  main: React.ReactNode
}

const ChatTemplate: React.FC<TemplateProps> = ({ aside, title, main }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <>
      <Header sx={{ position: 'static' }}>
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
      </Header>
      <Modal open={open} onClose={handleClose}>
        <Paper elevation={0} square sx={{ height: '100vh', width: '30%' }}>
          {aside}
        </Paper>
      </Modal>
      <Main>{main}</Main>
    </>
  )
}

export default ChatTemplate

const Header = styled(MuiAppBar)`
  border-bottom: 2px solid ${colors.primary};

  & .MuiToolbar-root {
    background-color: ${theme.palette.background.default};
  }
`

const Main = styled(Box)`
  height: calc(100vh - 66px);
  width: 100%;
  padding-top: 16px;
`
