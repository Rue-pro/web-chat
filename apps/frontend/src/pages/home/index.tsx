import { Divider, List } from '@mui/material'
import React from 'react'
import { LeftChatMessage } from '../../entities/chat-message/ui'
import { DialogRow } from '../../entities/dialog'

const HomePage: React.FC = () => (
  <>
    <div>Protected page</div>
    <div>
      <h1>Чат</h1>
      <List component="div" aria-label="users list">
        <DialogRow />
        <Divider />
        <DialogRow />
        <DialogRow />
        <Divider />
        <DialogRow />
      </List>
      <LeftChatMessage
        type="own"
        message="TextTextTextTextTextTextTextTextTextTextTextTextTextText Text Text Text
        Text Text Text Text Text Text Text TextTextText Text Text Text Text Text
        Text Text Text Text Text Text Text Text Text Text Text Text Text Text
        Text Text Text Text Text Text Text Text Text Text Text Text Text Text
        Text Text Text Text Text Text Text Text Text Text Text Text Text Text
        Text Text Text Text Text TextText TextText Text Text Text Text Text Text
        Text Text Text Text Text Text Text TextText Text Text Text"
      />
      <LeftChatMessage type="own" message="short message" />
      <LeftChatMessage
        type="their"
        message="longunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessagelongunbreakablemessage"
      />
    </div>
  </>
)

export default HomePage
