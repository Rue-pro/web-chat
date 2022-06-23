import React from 'react'

import useIsDevice from 'shared/lib/useIsDevice'
import DesktopChat from './desktop'
import MobileChat from './mobile'

const Chat: React.FC = () => {
  const { isDesktop } = useIsDevice()

  if (isDesktop) {
    return <DesktopChat />
  }
  return <MobileChat />
}

export default Chat
