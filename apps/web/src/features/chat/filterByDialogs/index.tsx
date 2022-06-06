import React, { ChangeEvent, useCallback, useState } from 'react'
import { Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import {
  DialogRow,
  DialogLoadingTemplate,
  DialogRowSketeton,
} from 'entities/dialog'
import { dateToRuDate } from 'shared/lib'
import { TDispatch, TStore } from 'shared/store'
import { SearchInput } from 'shared/ui/input'
import { useFindDialogsQuery } from 'shared/api/endpoints/dialogsApi'
import { DialogId } from 'shared/config'
import { CurrentDialogPayload, NewDialogId } from 'shared/store/dialogs/types'
import { dialogsActions } from 'shared/store/dialogs/dialogsSlice'

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
      newDialogId,
    }: {
      dialogId?: DialogId
      newDialogId: NewDialogId
    }) => {
      let payload: CurrentDialogPayload = dialogId
        ? {
            type: 'EXISTING_DIALOG',
            id: dialogId,
          }
        : {
            type: 'NEW_DIALOG',
            id: newDialogId,
          }
      dispatch(dialogsActions.setCurrentDialog(payload))
      setQuery('')
    },
    [dispatch],
  )

  return (
    <Box>
      <SearchInput
        placeholder="Find or start conversation"
        onChange={handleChangeSearchInput}
        debounceTimeout={100}
        defaultValue={query}
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
            }}
            title={dialog.user.name}
            message={dialog.message?.content ?? ''}
            sentTime={
              dialog.message?.createdAt
                ? dateToRuDate(new Date(dialog.message?.createdAt))
                : ''
            }
            onClick={() => {
              handleOpenDialog({
                dialogId: dialog.id,
                newDialogId: dialog.user.id,
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
