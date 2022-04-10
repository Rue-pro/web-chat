import React, { ChangeEvent, KeyboardEvent, useCallback, useState } from 'react'
import { styled } from '@mui/material'

import { Input as BaseInput } from 'shared/ui'
import { useDispatch } from 'react-redux'
import { chatActions } from 'shared/store/messagesSlice'

interface MessageInputProps {
  receiverId: string
}

const ChatInput: React.FC<MessageInputProps> = ({ receiverId }) => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState<string>('')

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }, [])

  const handleEnterClick = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      dispatch(
        chatActions.submitMessage({
          receiverId,
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
