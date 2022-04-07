import React, { ChangeEvent, useState } from 'react'
import { styled } from '@mui/material'

import {
  extendedApi,
  useSendMessageMutation,
} from 'shared/api/endpoints/messagesApi'
import { ActionButton, Input as BaseInput } from 'shared/ui'
import { useDispatch } from 'react-redux'
import { chatActions } from 'shared/store/messagesSlice'

interface MessageInputProps {
  receiverId: string
}

const MessageInput: React.FC<MessageInputProps> = ({ receiverId }) => {
  const dispatch = useDispatch()
  const [message, setMessage] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handleSubmit = (event: any) => {
    dispatch(
      chatActions.submitMessage({
        receiverId,
        content: message,
      }),
    )
    setMessage('')
  }

  return (
    <div>
      <Input
        formName="chat-input"
        inputId="adasd"
        variant="outlined"
        placeholder="Write a message..."
        onChange={handleChange}
      />
      <ActionButton onClick={handleSubmit}>Send</ActionButton>
    </div>
  )
}

export default MessageInput

const Input = styled(BaseInput)`
  width: 100%;
`
