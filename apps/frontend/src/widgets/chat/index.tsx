import React, { useState, ChangeEvent } from 'react'
import { Grid } from '@mui/material'
import { styled, Box } from '@mui/material'

import { ChatInput } from 'entities/chatMessage/ui'
import { Dialog, Dialogs, FilterByDialogs } from 'features/chat'

type ChatProps = {}

const Chat: React.FC<ChatProps> = () => {
  const [showDialogs, setShowDialogs] = useState<boolean>(true)
  const [currentDialog, setCurrentDialog] = useState<string | null>('')

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('CHAT_HANDLE_CHANGE_SEARCH_INPUT', e.target.value)
    console.log('Boolean(e.target.value)', Boolean(e.target.value))
    setShowDialogs(!Boolean(e.target.value))
  }

  const handleOpenDialog = (dialogId: string) => {
    console.log('CHAT_OPEN_DIALOG', dialogId)
    setCurrentDialog(dialogId)
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} sx={{ height: '800px', overflowY: 'auto' }}>
        <FilterByDialogs
          onSearch={handleSearch}
          onOpenDialog={handleOpenDialog}
        />

        {showDialogs && <Dialogs onOpenDialog={handleOpenDialog} />}
      </Grid>
      <Grid item xs={8}>
        <DialogContainer sx={{ height: '700px', overflowY: 'auto' }}>
          <Dialog id={currentDialog} />
        </DialogContainer>
        <ChatInput />
      </Grid>
    </Grid>
  )
}

export default Chat

const DialogContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`
