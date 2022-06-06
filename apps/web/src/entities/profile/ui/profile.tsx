import React from 'react'
import { useSelector } from 'react-redux'
import { Typography } from '@mui/material'

import { TStore } from 'shared/store'
import { useGetProfileQuery } from 'shared/api/endpoints/profileApi'
import { Avatar } from 'shared/ui/avatar'
import { ProfileSkeleton, ProfileTemplate } from '.'

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const userId = useSelector(
    (state: TStore) => state.AuthReducer.data.user.userId,
  )
  const { data, isLoading } = useGetProfileQuery(userId, {
    skip: !Boolean(userId),
  })

  if (isLoading || !data) return <ProfileSkeleton />

  return (
    <ProfileTemplate
      avatar={<Avatar src={data.avatar ?? ''} alt={data.name} />}
      name={
        <Typography variant="subtitle1" component="p">
          <b>{data.name}</b>
        </Typography>
      }
      phone={
        <Typography variant="subtitle1" component="p">
          {data.phone}
        </Typography>
      }
    />
  )
}

export default Profile
