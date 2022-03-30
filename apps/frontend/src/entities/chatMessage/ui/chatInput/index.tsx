import { styled } from '@mui/material'
import React, { ChangeEvent, useState } from 'react'
import {
  extendedApi,
  useSendMessageMutation,
} from 'shared/api/endpoints/messagesApi'
import { ActionButton, Input as BaseInput } from 'shared/ui'

type MessageInputProps = {}

const MessageInput: React.FC<MessageInputProps> = () => {
  console.log(extendedApi)
  const [message, setMessage] = useState('')
  const [sendMessage, { isLoading }] = useSendMessageMutation()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handleSubmit = (event: any) => {
    console.log(event)
    sendMessage(message)
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
