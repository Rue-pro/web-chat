import React, {
  KeyboardEvent,
  useState,
  ChangeEvent,
  useCallback,
  useEffect,
} from 'react'
import { useSelector } from 'react-redux'
import { Grid, styled } from '@mui/material'

import {
  Dialog as DialogDefault,
  Dialogs,
  FilterByDialogs,
} from 'features/chat'
import { ChatInput } from 'entities/chatMessage'
import { InfoTemplate } from 'shared/ui/template'
import { TStore } from 'shared/store'
import { dialogsActions } from 'shared/store/dialogs/dialogsSlice'
import { colors } from 'shared/theme/colors'
import { DialogTypes } from 'shared/store/dialogs/types'
import { Container } from 'shared/ui/contianer'

interface ChatProps {}

const Chat: React.FC<ChatProps> = () => {
  const [showDialogs, setShowDialogs] = useState<boolean>(true)
  const { currentDialog } = useSelector((state: TStore) => {
    return {
      currentDialog: state.DialogsReducer.data.currentDialog,
    }
  })

  useEffect(() => {
    if (currentDialog.type === DialogTypes.NEW_DIALOG) {
      console.log('CURRENT_DIALOG_CHANGED', currentDialog)
    }
  }, [currentDialog])

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setShowDialogs(!Boolean(e.target.value))
  }

  const handleOnSelect = () => {
    setShowDialogs(true)
  }

  const keyDownHandler = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      dialogsActions.setCurrentDialog({ type: DialogTypes.NO_DIALOG, id: null })
    }
  }, [])

  return (
    <Wrapper onKeyDown={keyDownHandler} tabIndex={0} container spacing={2}>
      <DialogsContainer item xs={4}>
        <Container>
          <FilterByDialogs onSearch={handleOnSearch} />
        </Container>

        {showDialogs && <Dialogs />}
      </DialogsContainer>
      <DialogContainer item xs={8}>
        {currentDialog.type === DialogTypes.NO_DIALOG ? (
          <InfoTemplate>Select a chat to start messaging</InfoTemplate>
        ) : (
          <>
            <Dialog />
            <ChatInput onSend={handleOnSelect} />
          </>
        )}
      </DialogContainer>
    </Wrapper>
  )
}

export default Chat

const Wrapper = styled(Grid)`
  outline: none;
  height: 100%;
`

const DialogsContainer = styled(Grid)`
  height: 100%;
  overflow-y: auto;
`

const Dialog = styled(DialogDefault)`
  height: calc(100% - 60px);
`

const DialogContainer = styled(Grid)`
  background-color: ${colors.gray[1]};
  height: 100%;
  padding-left: 20px;
  padding-right: 20px;
`
