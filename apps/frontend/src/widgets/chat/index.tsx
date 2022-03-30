import React from 'react'
import { Divider, Grid, List } from '@mui/material'
import { styled, Box } from '@mui/material'
import { ChatInput, ChatMessage } from 'entities/chatMessage/ui'
import { DialogRow, DialogRowSketeton } from 'entities/dialog'
import { useGetMessagesQuery } from 'shared/api/endpoints/messagesApi'

type ChatProps = {}

const Chat: React.FC<ChatProps> = () => {
  const { data: messages, isLoading } = useGetMessagesQuery()
  console.log(messages)
  console.log(isLoading)
  if (isLoading) {
    return <div>Показываю скелетон</div>
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} sx={{ height: '800px', overflowY: 'auto' }}>
        <List component="div" aria-label="users list">
          <DialogRow
            avatar={{
              src: 'https://mui.com/static/images/avatar/1.jpg',
              alt: 'Remy Sharp',
              isOnline: true,
            }}
            title="Remy Sharp"
            message="Это сообщение отправил Remy Sharp. Его еще не прочитали Это
            сообщение отправил Remy Sharp. Его еще не прочитали Это сообщение
            отправил Remy Sharp. Его еще не прочитали Это сообщение отправил
            Remy Sharp. Его еще не прочитали Это сообщение отправил Remy Sharp.
            Его еще не прочитали Это сообщение отправил Remy Sharp. Его еще не
            прочитали"
            sentTime="10:58 25.12.21"
            unreadedMessagesCount={1000}
          />
          <Divider />
          <DialogRowSketeton />
          <Divider />
          <DialogRow
            avatar={{
              src: 'https://mui.com/static/images/avatar/1.jpg',
              alt: 'Remy Sharp',
            }}
            title="Remy Sharp"
            message="Это сообщение отправил Remy Sharp. Его еще не прочитали Это
            сообщение отправил Remy Sharp. Его еще не прочитали Это сообщение
            отправил Remy Sharp. Его еще не прочитали Это сообщение отправил
            Remy Sharp. Его еще не прочитали Это сообщение отправил Remy Sharp.
            Его еще не прочитали Это сообщение отправил Remy Sharp. Его еще не
            прочитали"
            sentTime="10:58 25.12.21"
            unreadedMessagesCount={0}
          />
          <Divider />
          <DialogRow
            avatar={{
              src: 'https://mui.com/static/images/avatar/1.jpg',
              alt: 'Remy Sharp',
              isOnline: true,
            }}
            title="Remy Sharp"
            message="Это сообщение отправил Remy Sharp. Его еще не прочитали Это
            сообщение отправил Remy Sharp. Его еще не прочитали Это сообщение
            отправил Remy Sharp. Его еще не прочитали Это сообщение отправил
            Remy Sharp. Его еще не прочитали Это сообщение отправил Remy Sharp.
            Его еще не прочитали Это сообщение отправил Remy Sharp. Его еще не
            прочитали"
            sentTime="10:58 25.12.21"
            unreadedMessagesCount={99}
          />
        </List>
      </Grid>
      <Grid item xs={8}>
        <DialogsContainer sx={{ height: '700px', overflowY: 'auto' }}>
          {messages?.map(message => (
            <ChatMessage
              key={message.id}
              type="own"
              message={message.content}
              sentTime={'10:56'}
            />
          ))}
        </DialogsContainer>
        <ChatInput />
      </Grid>
    </Grid>
  )
}

export default Chat

const DialogsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`
