import React, { ChangeEvent, useCallback, useState } from 'react'
import { Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { SearchInput } from 'shared/ui'
import { useFindDialogsQuery } from 'shared/api/endpoints/dialogsApi'
import {
  DialogRow,
  DialogLoadingTemplate,
  DialogRowSketeton,
} from 'entities/dialog'
import { timeStampToRuDate } from 'shared/lib'
import { TDispatch, TStore } from 'shared/store'
import { dialogsActions } from 'shared/store/dialogsSlice'

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

  console.log('USERS', users)

  const handleChangeSearchInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      onSearch(e)
    },
    [onSearch],
  )

  const handleOpenDialog = useCallback(
    (id: number | null) => {
      dispatch(dialogsActions.setCurrentDialog({ dialogId: id }))
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
            key={dialog.id}
            id={dialog.user.id}
            avatar={{
              src: dialog.user.avatar,
              alt: dialog.user.name,
              isOnline: true,
            }}
            title={dialog.user.name}
            message={dialog.message?.content ?? ''}
            sentTime={timeStampToRuDate(dialog.message?.createdAt ?? '')}
            unreadedMessagesCount={0}
            onClick={() => {
              handleOpenDialog(dialog?.id ?? null)
            }}
            isCurrent={currentDialogId === dialog.id}
          />
        ))
      )}
    </Box>
  )
}

export default FilterByDialogs
