import React, { KeyboardEvent, useState, ChangeEvent, useCallback } from 'react'
import { Grid } from '@mui/material'

import { ChatInput } from 'entities/chatMessage/ui'
import { Dialog, Dialogs, FilterByDialogs } from 'features/chat'
import { InfoTemplate } from 'shared/ui/template'

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [showDialogs, setShowDialogs] = useState<boolean>(true)
  const [currentDialog, setCurrentDialog] = useState<string | null>(null)
  const [isDialogsLoaded, setDialogsLoaded] = useState<boolean>(false)

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setShowDialogs(!Boolean(e.target.value))
  }

  const handleOpenDialog = useCallback((dialogId: string) => {
    setCurrentDialog(dialogId)
  }, [])

  const handleOnLoadDialogs = useCallback((dialogId: string | null) => {
    if (dialogId) {
      setCurrentDialog(dialogId)
    } else {
      setDialogsLoaded(true)
    }
  }, [])

  const keyDownHandler = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      setCurrentDialog(null)
    }
  }, [])

  return (
    <Grid
      onKeyDown={keyDownHandler}
      tabIndex={0}
      container
      spacing={2}
      sx={{ outline: 'none', height: '100%' }}>
      <Grid item xs={4} sx={{ height: '100%', overflowY: 'auto' }}>
        <FilterByDialogs
          onSearch={handleOnSearch}
          onOpenDialog={handleOpenDialog}
        />

        {showDialogs && (
          <Dialogs
            onOpenDialog={handleOpenDialog}
            onLoadDialogs={handleOnLoadDialogs}
          />
        )}
      </Grid>
      <Grid item xs={8} sx={{ height: '100%' }}>
        {currentDialog ? (
          <>
            <Dialog id={currentDialog} />
            <ChatInput receiverId={currentDialog} />
          </>
        ) : (
          <InfoTemplate>Select a chat to start messaging</InfoTemplate>
        )}
      </Grid>
    </Grid>
  )
}

export default Chat
