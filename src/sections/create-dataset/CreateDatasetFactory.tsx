import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CreateDataset } from './CreateDataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { NotImplementedModalProvider } from '../not-implemented/NotImplementedModalProvider'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'

const datasetRepository = new DatasetJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()

export class CreateDatasetFactory {
  static create(): ReactElement {
    return (
      <NotImplementedModalProvider>
        <CreateDatasetWithSearchParams />
      </NotImplementedModalProvider>
    )
  }
}

function CreateDatasetWithSearchParams() {
  const [searchParams] = useSearchParams()
  const collectionId = searchParams.get('collectionId') ?? undefined

  return (
    <CreateDataset
      datasetRepository={datasetRepository}
      metadataBlockInfoRepository={metadataBlockInfoRepository}
      collectionRepository={collectionRepository}
      collectionId={collectionId}
    />
  )
}
