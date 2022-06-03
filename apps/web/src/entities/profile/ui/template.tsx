import React, { ReactElement, useCallback } from 'react'
import { Stack, Box, styled } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { ActionButton } from 'shared/ui/button'
import { PAGES } from 'shared/config'
import { authActions } from 'shared/store/auth/authSlice'
import { colors } from 'shared/theme/colors'

interface TemplateProps {
  avatar: ReactElement
  name: ReactElement
  phone: ReactElement
}

const Template: React.FC<TemplateProps> = ({ avatar, name, phone }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClick = useCallback(() => {
    dispatch(authActions.logout())
    navigate(PAGES.LoginPage)
  }, [dispatch, navigate])

  return (
    <Container>
      <Header>
        <AvatarContainer>{avatar}</AvatarContainer>
        {name}
        {phone}
      </Header>
      <Footer>
        <ActionButton onClick={handleClick} sx={{ width: '100%' }}>
          Log out
        </ActionButton>
      </Footer>
    </Container>
  )
}

export default Template

const Container = styled(Stack)`
  height: 100%;
  justify-content: space-between;
`

const Header = styled(Box)`
  background-color: ${colors.gray[1]};
  padding: 20px 16px;
`

const Footer = styled(Box)`
  padding: 20px 16px;
`

const AvatarContainer = styled(Box)`
  margin-bottom: 20px;
`
