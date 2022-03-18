import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
} from '@material-ui/data-grid'
import React from 'react'
import { useGetUsersQuery } from '../../../shared/store/services/user'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 130 },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    renderCell: (params: GridValueGetterParams) => {
      return (
        <img
          style={{ width: '25px', height: '25px' }}
          src={`${params.row.thumbnail.path}.${params.row.thumbnail.extension}`}
        />
      )
    },
  },
]

const CharactersQuery: React.FC = () => {
  const { data, isLoading } = useGetUsersQuery('adasd')
  console.log('data', data)
  console.log('isLoading', isLoading)
  if (isLoading) {
    return <div>Загружаю персонажей...</div>
  }
  if (!data) {
    return <div>Загружаю персонажей...</div>
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  )
}

export default CharactersQuery
