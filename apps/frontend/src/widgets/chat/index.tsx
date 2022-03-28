import React from 'react'
import { Divider, Grid, List } from '@mui/material'
import { styled, Box } from '@mui/material'
import { ChatMessage } from '../../entities/chatMessage/ui'
import { DialogRow, DialogRowSketeton } from '../../entities/dialog'

type ChatProps = {}

const Chat: React.FC<ChatProps> = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <List component="div" aria-label="users list">
          <DialogRow />
          <Divider />
          <DialogRowSketeton />
          <Divider />
          <DialogRow />
          <Divider />
          <DialogRow />
        </List>
      </Grid>
      <Grid item xs={8}>
        <DialogsContainer>
          <ChatMessage
            type="own"
            message="TextTextTextTextTextTextTextTextTextTextTextTextTextText Text Text Text
        Text Text Text Text Text Text Text TextTextText Text Text Text Text Text
        Text Text Text Text Text Text Text Text Text Text Text Text Text Text
        Text Text Text Text Text Text Text Text Text Text Text Text Text Text
        Text Text Text Text Text Text Text Text Text Text Text Text Text Text
        Text Text Text Text Text TextText TextText Text Text Text Text Text Text
        Text Text Text Text Text Text Text TextText Text Text Text"
          />
          <ChatMessage type="own" message="short message" />
          <ChatMessage
            type="their"
            message="longunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessage"
          />
        </DialogsContainer>
      </Grid>
    </Grid>
  )
}

export default Chat

const DialogsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`
