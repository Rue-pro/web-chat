import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { dateToRuDate, useToastError } from 'shared/lib'
import { TDispatch, TStore } from 'shared/store'
import { SearchInput } from 'shared/ui/input'
import { useFindDialogsQuery } from 'shared/api/endpoints/dialogs/dialogsApi'
import { DialogId } from 'shared/config'
import {
  CurrentDialogPayload,
  DialogTypes,
  NewDialogId,
} from 'shared/store/dialogs/types'
import { dialogsActions } from 'shared/store/dialogs/dialogsSlice'
import {
  DialogLoadingTemplate,
  DialogRow,
  DialogRowSkeleton,
} from 'entities/dialog'

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
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useFindDialogsQuery(query, {
    skip: !Boolean(query),
  })

  useEffect(() => {
    refetch()
  }, [refetch, query])

  useToastError(error)

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
      title,
    }: {
      dialogId?: DialogId
      newDialogId: NewDialogId
      title: string
    }) => {
      setQuery('')
      let payload: CurrentDialogPayload = dialogId
        ? {
            type: DialogTypes.EXISTING_DIALOG,
            id: dialogId,
            title,
          }
        : {
            type: DialogTypes.NEW_DIALOG,
            id: newDialogId,
            title,
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
        defaultValue={query}
      />
      {isLoading ? (
        <DialogLoadingTemplate
          skeleton={<DialogRowSkeleton />}
          skeletonsCount={6}
        />
      ) : (
        Boolean(query) &&
        users?.map(dialog => (
          <DialogRow
            key={dialog.user.id}
            avatar={{
              src: dialog.user.avatar,
              alt: dialog.user.name,
            }}
            title={dialog.user.name}
            message={dialog.message.content}
            sentTime={
              dialog.message.createdAt
                ? dateToRuDate(new Date(dialog.message?.createdAt))
                : ''
            }
            onClick={() => {
              handleOpenDialog({
                dialogId: dialog.id,
                newDialogId: dialog.user.id,
                title: dialog.user.name,
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
