import React, { useState, ChangeEvent, useCallback } from 'react'
import { Grid } from '@mui/material'
import { styled, Box } from '@mui/material'

import { ChatInput } from 'entities/chatMessage/ui'
import { Dialog, Dialogs, FilterByDialogs } from 'features/chat'

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [showDialogs, setShowDialogs] = useState<boolean>(true)
  const [currentDialog, setCurrentDialog] = useState<string>('')
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

  console.log(currentDialog)

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} sx={{ height: '800px', overflowY: 'auto' }}>
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
      <Grid item xs={8}>
        {currentDialog ? (
          <>
            <Dialog id={currentDialog} />
            <ChatInput receiverId={currentDialog} />
          </>
        ) : (
          /**
           * TODO сделать единый компоенент на всю ширину и высоту с полупрозрачным гигантским текстом ну или рисунок
           */
          <Box>Select a chat to start messaging</Box>
        )}
      </Grid>
    </Grid>
  )
}

export default Chat
