import React, { useState, ChangeEvent, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Stack, Grid, Modal, styled } from '@mui/material'

import {
  Dialog as DialogDefault,
  Dialogs,
  FilterByDialogs,
} from 'features/chat'
import { ChatInput } from 'entities/chatMessage'
import { TStore } from 'shared/store'
import { colors } from 'shared/theme/colors'
import { DialogTypes } from 'shared/store/dialogs/types'
import { Container } from 'shared/ui/contianer'
import { DialogHeader } from 'entities/dialog'

const MobileChat: React.FC = () => {
  const [openModal, setOpenModal] = useState(false)
  const [showDialogs, setShowDialogs] = useState<boolean>(true)
  const { currentDialog } = useSelector((state: TStore) => {
    return {
      currentDialog: state.DialogsReducer.data.currentDialog,
    }
  })

  useEffect(() => {
    setOpenModal(currentDialog.type !== DialogTypes.NO_DIALOG)
  }, [currentDialog])

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setShowDialogs(!Boolean(e.target.value))
  }

  const handleCloseModal = useCallback(() => {
    setOpenModal(false)
  }, [])

  return (
    <Wrapper tabIndex={0} container spacing={2}>
      <DialogsContainer item xs={12}>
        <Container>
          <FilterByDialogs onSearch={handleOnSearch} />
        </Container>

        {showDialogs && <Dialogs />}
      </DialogsContainer>
      <Modal open={openModal} onClose={handleCloseModal}>
        <DialogModal>
          <DialogHeader
            title={
              currentDialog.type === DialogTypes.NO_DIALOG
                ? 'Dialog detail'
                : currentDialog.title
            }
            onGoBack={handleCloseModal}
          />
          <Dialog />
          <Container>
            <ChatInput />
          </Container>
        </DialogModal>
      </Modal>
    </Wrapper>
  )
}

export default MobileChat

const Wrapper = styled(Grid)`
  outline: none;
  height: 100%;
`

const DialogsContainer = styled(Grid)`
  height: 100%;
  overflow-y: auto;
  padding-left: 20px;
  padding-right: 20px;
`

const Dialog = styled(DialogDefault)`
  height: calc(100% - 162px);
`

const DialogModal = styled(Stack)`
  height: 100%;
  background-color: ${colors.gray[1]};
`
