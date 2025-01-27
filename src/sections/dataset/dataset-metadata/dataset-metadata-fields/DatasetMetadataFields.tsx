import { DatasetMetadataField } from './DatasetMetadataField'
import { DatasetMetadataFields as DatasetMetadataFieldsModel } from '../../../../dataset/domain/models/Dataset'
import { MetadataBlockName } from '../../../../dataset/domain/models/Dataset'
import { MetadataBlockInfoDisplayFormat } from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'

interface DatasetMetadataFieldsProps {
  metadataBlockName: MetadataBlockName
  metadataFields: DatasetMetadataFieldsModel
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat
}

export function DatasetMetadataFields({
  metadataBlockName,
  metadataFields,
  metadataBlockDisplayFormatInfo
}: DatasetMetadataFieldsProps) {
  return (
    <>
      {Object.entries(metadataFields).map(([metadataFieldName, metadataFieldValue], index) => (
        <DatasetMetadataField
          key={`${metadataBlockName}-${metadataFieldName}-${index}`}
          metadataBlockName={metadataBlockName}
          metadataFieldName={metadataFieldName}
          metadataFieldValue={metadataFieldValue}
          metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
        />
      ))}
    </>
  )
}
