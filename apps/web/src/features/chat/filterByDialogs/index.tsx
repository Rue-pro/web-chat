import React, { ChangeEvent, useCallback, useState } from 'react'
import { Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import {
  DialogRow,
  DialogLoadingTemplate,
  DialogRowSketeton,
} from 'entities/dialog'
import { timeStampToRuDate } from 'shared/lib'
import { TDispatch, TStore } from 'shared/store'
import {
  DialogId,
  dialogsActions,
  ReceiverId,
  CurrentDialogPayload,
} from 'shared/store/dialogsSlice'
import { SearchInput } from 'shared/ui'
import { useFindDialogsQuery } from 'shared/api/endpoints/dialogsApi'

interface FilterByUsersProps {
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void
}

const FilterByDialogs: React.FC<FilterByUsersProps> = ({ onSearch }) => {
  const dispatch = useDispatch<TDispatch>()
  const { currentDialogId } = useSelector((state: TStore) => {
    return {
      currentDialogId: state.DialogsReducer.data.currentDialog.id,
    }
  })

  const [query, setQuery] = useState<string>('')
  const { data: users, isLoading } = useFindDialogsQuery(query, {
    skip: !Boolean(query),
  })

  const handleChangeSearchInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      onSearch(e)
    },
    [onSearch],
  )

  const handleOpenDialog = useCallback(
    ({
      dialogId,
      receiverId,
    }: {
      dialogId: DialogId
      receiverId: ReceiverId
    }) => {
      let payload: CurrentDialogPayload = {
        dialogId: dialogId,
      }
      if (!dialogId) {
        payload.receiverId = receiverId
      }
      dispatch(dialogsActions.setCurrentDialog(payload))
    },
    [dispatch],
  )

  return (
    <Box>
      <SearchInput
        placeholder="Find or start conversation"
        onChange={handleChangeSearchInput}
        debounceTimeout={100}
      />
      {isLoading ? (
        <DialogLoadingTemplate
          skeleton={<DialogRowSketeton />}
          skeletonsCount={6}
        />
      ) : (
        Boolean(query) &&
        users?.map(dialog => (
          <DialogRow
            key={dialog.user.id}
            avatar={{
              src: dialog.user.avatar ?? '',
              alt: dialog.user.name,
              isOnline: true,
            }}
            title={dialog.user.name}
            message={dialog.message?.content ?? ''}
            sentTime={timeStampToRuDate(dialog.message?.createdAt ?? '')}
            unreadedMessagesCount={0}
            onClick={() => {
              handleOpenDialog({
                dialogId: dialog?.id ?? null,
                receiverId: dialog.user.id,
              })
            }}
            isCurrent={currentDialogId === dialog.id}
          />
        ))
      )}
    </Box>
  )
}

export default FilterByDialogs
