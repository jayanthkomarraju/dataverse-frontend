import { useEffect, useState } from 'react'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { getCoreRowModel, Row, useReactTable } from '@tanstack/react-table'
import { createColumnsDefinition } from './FilesTableColumnsDefinition'
import { useFileSelectionScrollable } from './row-selection/useFileSelectionScrollable'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'

export type RowSelection = {
  [key: string]: boolean
}

export function useFilesTableScrollable(
  files: FilePreview[],
  paginationInfo: FilePaginationInfo,
  accumulatedFilesCount?: number
) {
  const [currentPageRowSelection, setCurrentPageRowSelection] = useState<RowSelection>({})
  const [currentPageSelectedRowModel, setCurrentPageSelectedRowModel] = useState<
    Record<string, Row<FilePreview>>
  >({})
  const { fileSelection, selectAllFiles, clearFileSelection } = useFileSelectionScrollable(
    currentPageSelectedRowModel,
    setCurrentPageRowSelection,
    paginationInfo
  )
  const table = useReactTable({
    data: files,
    columns: createColumnsDefinition(paginationInfo, fileSelection, accumulatedFilesCount),
    state: {
      rowSelection: currentPageRowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setCurrentPageRowSelection,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: paginationInfo.totalPages
  })

  const selectedRowsById = table.getSelectedRowModel().rowsById

  console.log('Selected Rows: ', selectedRowsById)

  useEffect(() => {
    table.setPageSize(paginationInfo.pageSize)
    table.setPageIndex(paginationInfo.page - 1)
  }, [paginationInfo, table])

  useEffect(() => {
    setCurrentPageSelectedRowModel(selectedRowsById)
  }, [selectedRowsById])

  return {
    table,
    fileSelection,
    selectAllFiles,
    clearFileSelection
  }
}
