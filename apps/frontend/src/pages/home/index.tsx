import React from 'react'
import { useSelector } from 'react-redux'

import Chat from 'widgets/chat'
import { TStore } from 'shared/store'
import { useGetProfileQuery } from 'shared/api/endpoints/profileApi'

const HomePage: React.FC = () => {
  const userId = useSelector((state: TStore) => state.AuthReducer.data.userId)

  const { data, isLoading } = useGetProfileQuery(userId, {
    skip: !Boolean(userId),
  })

  return (
    <>
      <div>Protected page</div>
      {isLoading ? 'Данные о пользователе загружаются' : data?.name}
      <h1>Чат</h1>
      <Chat />
    </>
  )
}

export default HomePage
