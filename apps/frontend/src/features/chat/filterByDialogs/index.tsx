import React, { ChangeEvent, useCallback, useState } from 'react'
import { Box } from '@mui/material'

import { SearchInput } from 'shared/ui'
import {
  SearchDialogResult,
  useFindDialogsQuery,
} from 'shared/api/endpoints/dialogsApi'
import {
  DialogRow,
  DialogLoadingTemplate,
  DialogRowSketeton,
} from 'entities/dialog'

interface FilterByUsersProps {
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void
  onOpenDialog: (dialogId: string) => void
}

const FilterByDialogs: React.FC<FilterByUsersProps> = ({
  onSearch,
  onOpenDialog,
}) => {
  const [query, setQuery] = useState<string>('')
  const { data, isLoading } = useFindDialogsQuery(query, {
    skip: !Boolean(query),
  })

  const handleChangeSearchInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
      onSearch(e)
    },
    [onSearch],
  )

  return (
    <Box>
      <SearchInput
        placeholder="Find or search dialog"
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
        data?.map((dialog: SearchDialogResult) => (
          <DialogRow
            key={dialog.user.id}
            id={dialog.user.id}
            avatar={{
              src: dialog.user.avatar,
              alt: dialog.user.name,
              isOnline: true,
            }}
            title={dialog.user.name}
            message={dialog.message?.content ?? ''}
            sentTime={dialog.message?.createdAt ?? ''}
            unreadedMessagesCount={0}
            onClick={() => {
              onOpenDialog(dialog.user.id)
            }}
          />
        ))
      )}
    </Box>
  )
}

export default FilterByDialogs
