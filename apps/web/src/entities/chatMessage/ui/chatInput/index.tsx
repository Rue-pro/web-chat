import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'
import { styled } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { Input as BaseInput } from 'shared/ui'
import { TDispatch, TStore } from 'shared/store'
import { messagesActions } from 'shared/store/messagesSlice'

interface MessageInputProps {}

const ChatInput: React.FC<MessageInputProps> = () => {
  const dispatch = useDispatch<TDispatch>()
  const { currentDialogId, currentDialogReceiverId } = useSelector(
    (state: TStore) => {
      return {
        currentDialogId: state.DialogsReducer.data.currentDialog.id,
        currentDialogReceiverId:
          state.DialogsReducer.data.currentDialog.receiverId,
      }
    },
  )
  const [message, setMessage] = useState<string>('')

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }, [])

  const handleEnterClick = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      dispatch(
        messagesActions.submitMessage({
          dialogId: currentDialogId || 0,
          receiverId: currentDialogReceiverId || '',
          content: message,
        }),
      )
      setMessage('')
    }
  }

  return (
    <div>
      <Input
        formName="chat-input"
        inputId="adasd"
        variant="outlined"
        placeholder="Write a message..."
        onChange={handleChange}
        onKeyPress={handleEnterClick}
        value={message}
      />
    </div>
  )
}

export default ChatInput

const Input = styled(BaseInput)`
  width: 100%;
`