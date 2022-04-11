import React from 'react'
import { useSelector } from 'react-redux'
import { Typography } from '@mui/material'

import { TStore } from 'shared/store'
import { useGetProfileQuery } from 'shared/api/endpoints/profileApi'
import { ProfileSkeleton, ProfileTemplate } from '..'
import { AvatarBadge } from 'shared/ui'

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
  const userId = useSelector((state: TStore) => state.AuthReducer.data.userId)
  const { data, isLoading } = useGetProfileQuery(userId, {
    skip: !Boolean(userId),
  })

  if (isLoading || !data) return <ProfileSkeleton />

  return (
    <ProfileTemplate
      avatar={<AvatarBadge src={data.avatar} alt={data.name} />}
      name={
        <Typography variant="subtitle1" component="p" color="#FFFFFF">
          {data.name}
        </Typography>
      }
      phone={
        <Typography variant="subtitle1" component="p" color="#FFFFFF">
          {data.phone}
        </Typography>
      }
    />
  )
}

export default Profile
