import React, { MouseEvent, useState } from 'react'
import { Divider, Grid, List } from '@mui/material'
import { styled, Box } from '@mui/material'
import { ChatInput, ChatMessage } from 'entities/chatMessage/ui'
import { DialogRow, DialogRowSketeton } from 'entities/dialog'
import { useGetMessagesQuery } from 'shared/api/endpoints/messagesApi'
import { useGetUsersQuery } from 'shared/api/endpoints/dialogsApi'

type ChatProps = {}

const Chat: React.FC<ChatProps> = () => {
  const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery()
  const { data: dialogs, isLoading: isDialogsLoading } = useGetUsersQuery()
  const [currentDialog, setCurrentDialog] = useState<string>('')
  console.log(messages)
  console.log(isMessagesLoading)
  console.log('DIALOGS', dialogs)

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    console.log('yo')
    console.log(e)
  }

  if (isMessagesLoading) {
    return <div>Показываю скелетон</div>
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} sx={{ height: '800px', overflowY: 'auto' }}>
        <List component="div" aria-label="users list">
          {isDialogsLoading ? (
            <>
              <DialogRowSketeton />
              <Divider />
              <DialogRowSketeton />
              <Divider />
              <DialogRowSketeton />
              <Divider />
              <DialogRowSketeton />
              <Divider />
            </>
          ) : (
            <>
              {/*  TODO unreadedMessagesCount={1000} */}
              {dialogs?.map(dialog => (
                <Box
                  key={dialog.user.id}
                  data-id={dialog.user.id}
                  onClick={handleClick}>
                  <DialogRow
                    avatar={{
                      src: dialog.user.avatar,
                      alt: dialog.user.name,
                      isOnline: true,
                    }}
                    title={dialog.user.name}
                    message={dialog.message?.content ?? ''}
                    sentTime={dialog.message?.createdAt ?? ''}
                    unreadedMessagesCount={1000}
                  />
                </Box>
              ))}
            </>
          )}
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
