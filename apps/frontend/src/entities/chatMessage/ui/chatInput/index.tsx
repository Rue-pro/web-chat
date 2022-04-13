import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'
import { styled } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { Input as BaseInput } from 'shared/ui'
import { messagesActions } from 'shared/store/messagesSlice'
import { TDispatch, TStore } from 'shared/store'

interface MessageInputProps {}

const ChatInput: React.FC<MessageInputProps> = () => {
  const dispatch = useDispatch<TDispatch>()
  const { currentDialog } = useSelector((state: TStore) => {
    return {
      currentDialog: state.DialogsReducer.data.currentDialogId,
    }
  })
  const [message, setMessage] = useState<string>('')

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }, [])

  const handleEnterClick = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      dispatch(
        messagesActions.submitMessage({
          dialogId: currentDialog,
          content: message,
        }),
      )
      setMessage('')
    }
  }
  console.log('MEssage', message)
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
