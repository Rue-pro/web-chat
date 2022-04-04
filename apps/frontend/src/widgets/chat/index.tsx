import React, { MouseEvent, useState, ChangeEvent } from 'react'
import { Divider, Grid, List } from '@mui/material'
import { styled, Box } from '@mui/material'
import { ChatInput, ChatMessage } from 'entities/chatMessage/ui'
import { DialogRow, DialogRowSketeton } from 'entities/dialog'
import { useGetMessagesQuery } from 'shared/api/endpoints/messagesApi'
import {
  useGetDialogsQuery,
  useFindDialogsQuery,
} from 'shared/api/endpoints/dialogsApi'
import { SearchInput } from 'shared/ui'

type ChatProps = {}

const Chat: React.FC<ChatProps> = () => {
  const { data: messages, isLoading: isMessagesLoading } = useGetMessagesQuery()
  const { data: dialogs, isLoading: isDialogsLoading } = useGetDialogsQuery()
  const { data, isLoading: isDataLoading } = useFindDialogsQuery()
  const [currentDialog, setCurrentDialog] = useState<string>('')
  console.log(messages)
  console.log(isMessagesLoading)
  console.log('DATA', data)

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    console.log('yo')
    console.log(e)
  }

  const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('deqwd')
    console.log(e)
  }

  if (isMessagesLoading) {
    return <div>Показываю скелетон</div>
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={4} sx={{ height: '800px', overflowY: 'auto' }}>
        <SearchInput
          placeholder="Find or search dialog"
          onChange={handleChangeSearchInput}
          debounceTimeout={300}
        />
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
