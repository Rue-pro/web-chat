import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'
import { styled } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { Input as BaseInput } from 'shared/ui/input'
import { TDispatch, TStore } from 'shared/store'
import { messagesActions } from 'shared/store/messagesSlice'
import { colors } from 'shared/theme/colors'

interface MessageInputProps {}

const ChatInput: React.FC<MessageInputProps> = () => {
  const dispatch = useDispatch<TDispatch>()
  const { currentDialog } = useSelector((state: TStore) => {
    return {
      currentDialog: state.DialogsReducer.data.currentDialog,
    }
  })

  const [message, setMessage] = useState<string>('')

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }, [])

  const handleEnterClick = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      if (currentDialog.type === 'NO_DIALOG') {
        return
      }
      const dialogMessage = {
        content: message,
        currentDialog,
      }
      dispatch(messagesActions.submitMessage(dialogMessage))
      setMessage('')
    }
  }

  if (currentDialog.type === 'NO_DIALOG') {
    return <></>
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

  & input:-webkit-autofill {
    box-shadow: ${`0 0 0 100px ${colors.gray[1]} inset`};
  }
`
