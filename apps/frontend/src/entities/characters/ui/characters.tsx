import React, { useEffect, useState } from 'react'
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
} from '@material-ui/data-grid'
import { useDispatch, useSelector } from 'react-redux'
import { TStore } from '../../../shared/store/store'
import { fetchCharacters } from '../../../shared/store/reducers/charactersSlice'

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

const Characters: React.FC = () => {
  const dispatch = useDispatch()
  const { characters, status } = useSelector(
    (state: TStore) => state.characters,
  )
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    dispatch(fetchCharacters())
  }, [])

  useEffect(() => {
    console.log('compoenntDidMount')
  }, [])
  useEffect(() => {
    console.log('componentDidUpdate')
    return () => {
      console.log('componentWillUnmount')
    }
  }, [counter])

  if (status === 'loading') {
    return <div>Загружаю персонажей...</div>
  }

  return (
    <div style={{ height: 400, width: '100%' }}>
      <div id="counter" onClick={() => setCounter(counter + 1)}>
        {counter}
      </div>
      <DataGrid
        rows={characters}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  )
}

export default Characters
