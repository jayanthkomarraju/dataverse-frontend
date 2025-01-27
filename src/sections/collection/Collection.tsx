import { Alert, Col, Row } from '@iqss/dataverse-design-system'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetsList } from './datasets-list/DatasetsList'
import { DatasetsListWithInfiniteScroll } from './datasets-list/DatasetsListWithInfiniteScroll'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'

import styles from './Collection.module.scss'
import AddDataActionsButton from '../shared/add-data-actions/AddDataActionsButton'
import { useSession } from '../session/SessionContext'
import { useCollection } from './useCollection'
import { CollectionRepository } from '../../collection/domain/repositories/CollectionRepository'
import { PageNotFound } from '../page-not-found/PageNotFound'
import { CollectionSkeleton } from './CollectionSkeleton'
import { CollectionInfo } from './CollectionInfo'
import { Trans, useTranslation } from 'react-i18next'
import { useScrollTop } from '../../shared/hooks/useScrollTop'
import { useGetCollectionUserPermissions } from '../../shared/hooks/useGetCollectionUserPermissions'

interface CollectionProps {
  repository: CollectionRepository
  datasetRepository: DatasetRepository
  id: string
  created: boolean
  page?: number
  infiniteScrollEnabled?: boolean
}

export function Collection({
  repository,
  id,
  datasetRepository,
  created,
  page,
  infiniteScrollEnabled = false
}: CollectionProps) {
  useScrollTop()
  const { user } = useSession()
  const { collection, isLoading } = useCollection(repository, id)
  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: id,
    collectionRepository: repository
  })

  const canUserAddCollection = Boolean(collectionUserPermissions?.canAddCollection)
  const canUserAddDataset = Boolean(collectionUserPermissions?.canAddDataset)

  const showAddDataActions = user && (canUserAddCollection || canUserAddDataset)

  const { t } = useTranslation('collection')

  if (!isLoading && !collection) {
    return <PageNotFound />
  }

  return (
    <Row>
      <Col>
        {!collection ? (
          <CollectionSkeleton />
        ) : (
          <>
            <BreadcrumbsGenerator hierarchy={collection.hierarchy} />
            <CollectionInfo collection={collection} />
            {created && (
              <Alert variant="success" dismissible={false}>
                <Trans
                  t={t}
                  i18nKey="createdAlert"
                  components={{
                    anchor: (
                      <a
                        href="https://guides.dataverse.org/en/latest/user/dataverse-management.html"
                        target="_blank"
                        rel="noreferrer"
                      />
                    )
                  }}
                />
              </Alert>
            )}
            {showAddDataActions && (
              <div className={styles.container}>
                <AddDataActionsButton
                  collectionId={id}
                  canAddCollection={canUserAddCollection}
                  canAddDataset={canUserAddDataset}
                />
              </div>
            )}
          </>
        )}
        {infiniteScrollEnabled ? (
          <DatasetsListWithInfiniteScroll
            datasetRepository={datasetRepository}
            collectionId={id}
            key={id}
          />
        ) : (
          <DatasetsList
            datasetRepository={datasetRepository}
            page={page}
            collectionId={id}
            key={id}
          />
        )}
      </Col>
    </Row>
  )
}
