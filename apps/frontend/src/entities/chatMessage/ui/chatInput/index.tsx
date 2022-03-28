import { styled } from '@mui/material'
import React from 'react'
import { Input as BaseInput } from 'shared/ui'

type MessageInputProps = {}

const MessageInput: React.FC<MessageInputProps> = () => {
  return (
    <div>
      <Input
        formName="chat-input"
        inputId="adasd"
        variant="outlined"
        placeholder="Write a message..."
      />
    </div>
  )
}

export default MessageInput

const Input = styled(BaseInput)`
  width: 100%;
`
