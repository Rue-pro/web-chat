import React, { KeyboardEvent, useState, ChangeEvent, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'

import { Dialog, Dialogs, FilterByDialogs } from 'features/chat'
import { ChatInput } from 'entities/chatMessage'
import { InfoTemplate } from 'shared/ui/template'
import { TStore } from 'shared/store'
import { dialogsActions } from 'shared/store/dialogsSlice'

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [showDialogs, setShowDialogs] = useState<boolean>(true)
  const { currentDialogId, currentDialogReceiverId } = useSelector(
    (state: TStore) => {
      return {
        currentDialogId: state.DialogsReducer.data.currentDialog.id,
        currentDialogReceiverId:
          state.DialogsReducer.data.currentDialog.receiverId,
      }
    },
  )

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setShowDialogs(!Boolean(e.target.value))
  }

  const keyDownHandler = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      dialogsActions.setCurrentDialog({ dialogId: null })
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
        <FilterByDialogs onSearch={handleOnSearch} />

        {showDialogs && <Dialogs />}
      </Grid>
      <Grid item xs={8} sx={{ height: '100%' }}>
        {currentDialogId || currentDialogReceiverId ? (
          <>
            <Dialog />
            <ChatInput />
          </>
        ) : (
          <InfoTemplate>Select a chat to start messaging</InfoTemplate>
        )}
      </Grid>
    </Grid>
  )
}

export default Chat
