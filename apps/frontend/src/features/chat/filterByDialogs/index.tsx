import React, { ChangeEvent, useCallback, useState } from 'react'
import { Box } from '@mui/material'

import { SearchInput } from 'shared/ui'
import { useFindDialogsQuery } from 'shared/api/endpoints/dialogsApi'
import {
  DialogRow,
  DialogLoadingTemplate,
  DialogRowSketeton,
} from 'entities/dialog'
import { timeStampToRuDate } from 'shared/lib'

interface FilterByUsersProps {
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void
  onOpenDialog: (dialogId: string) => void
  currentDialog: string | null
}

const FilterByDialogs: React.FC<FilterByUsersProps> = ({
  onSearch,
  onOpenDialog,
  currentDialog,
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
        data?.map(dialog => (
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
            sentTime={timeStampToRuDate(dialog.message?.createdAt ?? '')}
            unreadedMessagesCount={0}
            onClick={() => {
              onOpenDialog(dialog.user.id)
            }}
            isCurrent={currentDialog === dialog.user.id}
          />
        ))
      )}
    </Box>
  )
}

export default FilterByDialogs
