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
            <DialogContainer sx={{ height: '700px', overflowY: 'auto' }}>
              <Dialog id={currentDialog} />
            </DialogContainer>
            <ChatInput receiverId={currentDialog} />
          </>
        ) : (
          /**
           * TODO сделать единый компоенент на всю ширину и высоту с полупрозрачным гигантским текстом ну или рисунок
           */
          <Box>Sorry, no dialog was chosen</Box>
        )}
      </Grid>
    </Grid>
  )
}

export default Chat

const DialogContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`
