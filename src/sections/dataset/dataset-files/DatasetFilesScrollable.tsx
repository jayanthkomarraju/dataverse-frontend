import { useMemo, useRef, useState } from 'react'
import useInfiniteScroll, { UseInfiniteScrollHookRefCallback } from 'react-infinite-scroll-hook'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { useGetAccumulatedFiles } from './useGetAccumulatedFiles'
import { useGetFilesCountInfo } from './useGetFilesCountInfo'
import { useGetFilesTotalDownloadSize } from './useGetFilesTotalDownloadSize'
import { useObserveElementSize } from '../../../shared/hooks/useObserveElementSize'
import { FilesTableScrollable } from './files-table/FilesTableScrollable'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import cn from 'classnames'
import styles from './DatasetFilesScrollable.module.scss'

interface DatasetFilesScrollableProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

export type SentryRef = UseInfiniteScrollHookRefCallback

export function DatasetFilesScrollable({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesScrollableProps) {
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null)
  const criteriaContainerRef = useRef<HTMLDivElement | null>(null)
  const criteriaContainerSize = useObserveElementSize(criteriaContainerRef)

  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(
    () => new FilePaginationInfo()
  )
  const [criteria, setCriteria] = useState<FileCriteria>(() => new FileCriteria())

  const {
    filesCountInfo,
    isLoading: _isLoadingFilesCountInfo,
    error: _errorFilesCountInfo
  } = useGetFilesCountInfo({
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  })

  const {
    filesTotalDownloadSize,
    isLoading: _isLoadingFilesTotalDownloadSize,
    error: _errorFilesTotalDownloadSize
  } = useGetFilesTotalDownloadSize({
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  })

  const {
    loadMore,
    accumulatedFiles,
    accumulatedCount,
    isLoading,
    error,
    areFilesAvailable,
    totalAvailable,
    hasNextPage,
    isEmptyFiles
  } = useGetAccumulatedFiles({
    filesRepository,
    datasetPersistentId,
    datasetVersion
  })

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: () => void handleOnLoadMore(paginationInfo),
    disabled: !!error,
    rootMargin: '0px 0px 150px 0px'
  })

  async function handleOnLoadMore(currentPagination: FilePaginationInfo) {
    try {
      let paginationInfoToSend = currentPagination

      if (totalAvailable !== undefined) {
        paginationInfoToSend = currentPagination.goToNextPage()
      }

      const totalFilesCount = await loadMore(paginationInfoToSend, criteria)

      const paginationInfoUpdated = paginationInfoToSend.withTotal(totalFilesCount as number)

      setPaginationInfo(paginationInfoUpdated)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCriteriaChange = async (newCriteria: FileCriteria) => {
    scrollableContainerRef.current?.scrollTo({ top: 0 })

    setCriteria(newCriteria)

    const resetedPaginationInfo = new FilePaginationInfo()
    setPaginationInfo(resetedPaginationInfo)

    try {
      const totalFilesCount = await loadMore(resetedPaginationInfo, newCriteria, true)

      const paginationInfoUpdated = resetedPaginationInfo.withTotal(totalFilesCount as number)

      setPaginationInfo(paginationInfoUpdated)
    } catch (error) {
      console.error(error)
    }
  }

  const showSentryRef = useMemo(
    () => hasNextPage && !error && !isEmptyFiles,
    [hasNextPage, error, isEmptyFiles]
  )

  // TODO:ME Check download only downloading 10 files. Check sticky also for this ones
  // TODO:ME If there is some error show it some how?
  // TODO:ME Check styles of table on Safari (horizontal scrollbar is shown and linear gradient not working)
  // TODO:ME Persist state in session storage to avoid losing state when navigating back and forth?

  return (
    <section ref={rootRef}>
      <div
        className={cn(styles['files-scrollable-container'], {
          [styles['files-scrollable-container--empty']]: !areFilesAvailable
        })}
        ref={scrollableContainerRef}>
        <header ref={criteriaContainerRef} className={styles['criteria-form-container']}>
          <FileCriteriaForm
            criteria={criteria}
            onCriteriaChange={handleCriteriaChange}
            filesCountInfo={filesCountInfo}
            onInfiniteScrollMode
          />
        </header>

        <FilesTableScrollable
          files={accumulatedFiles}
          paginationInfo={paginationInfo}
          filesTotalDownloadSize={filesTotalDownloadSize}
          criteriaContainerHeight={criteriaContainerSize.height}
          sentryRef={sentryRef}
          showSentryRef={showSentryRef}
          isEmptyFiles={isEmptyFiles}
          accumulatedCount={accumulatedCount}
        />
      </div>
    </section>
  )
}
