import React, { KeyboardEvent, useState, ChangeEvent, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Box, Grid, styled } from '@mui/material'

import { Dialog, Dialogs, FilterByDialogs } from 'features/chat'
import { ChatInput } from 'entities/chatMessage'
import { InfoTemplate } from 'shared/ui/template'
import { TStore } from 'shared/store'
import { dialogsActions } from 'shared/store/dialogsSlice'
import { colors } from 'shared/theme/colors'

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [showDialogs, setShowDialogs] = useState<boolean>(true)
  const { currentDialog } = useSelector((state: TStore) => {
    return {
      currentDialog: state.DialogsReducer.data.currentDialog,
    }
  })

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setShowDialogs(!Boolean(e.target.value))
  }

  const keyDownHandler = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      dialogsActions.setCurrentDialog({ type: 'NO_DIALOG', id: null })
    }
  }, [])

  return (
    <Container onKeyDown={keyDownHandler} tabIndex={0} container spacing={2}>
      <DialogsContainer item xs={4}>
        <FilterContainer>
          <FilterByDialogs onSearch={handleOnSearch} />
        </FilterContainer>

        {showDialogs && <Dialogs />}
      </DialogsContainer>
      <DialogContainer item xs={8}>
        {currentDialog.type === 'NO_DIALOG' ? (
          <InfoTemplate>Select a chat to start messaging</InfoTemplate>
        ) : (
          <>
            <Dialog />
            <ChatInput />
          </>
        )}
      </DialogContainer>
    </Container>
  )
}

export default Chat

const Container = styled(Grid)`
  outline: none;
  height: 100%;
`

const DialogsContainer = styled(Grid)`
  height: 100%;
  overflow-y: auto;
`

const DialogContainer = styled(Grid)`
  background-color: ${colors.gray[1]};
  height: 100%;
`

const FilterContainer = styled(Box)`
  margin-left: 20px;
  margin-right: 20px;
`
