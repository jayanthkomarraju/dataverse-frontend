import { Dataset } from '../../../../dataset/domain/models/Dataset'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { useSettings } from '../../../settings/SettingsContext'
import { useEffect, useState } from 'react'
import { SettingName } from '../../../../settings/domain/models/Setting'
import { HasPublicStore } from '../../../../settings/domain/models/HasPublicStore'
import { useTranslation } from 'react-i18next'

interface EditDatasetPermissionsMenuProps {
  dataset: Dataset
}
export function EditDatasetPermissionsMenu({ dataset }: EditDatasetPermissionsMenuProps) {
  const { t } = useTranslation('dataset')
  const { getSettingByName } = useSettings()
  const [hasPublicStore, setHasPublicStore] = useState<HasPublicStore>(false)

  useEffect(() => {
    getSettingByName<HasPublicStore>(SettingName.HAS_PUBLIC_STORE)
      .then((hasPublicStoreSetting) => {
        setHasPublicStore(hasPublicStoreSetting.value)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [getSettingByName])

  if (
    !dataset.permissions.canManageDatasetPermissions &&
    !dataset.permissions.canManageFilesPermissions
  ) {
    return <></>
  }

  if (hasPublicStore) {
    return (
      <DropdownButtonItem>
        {t('datasetActionButtons.editDataset.permissions.title')}
      </DropdownButtonItem>
    )
  }

  return (
    <DropdownButton
      id={`edit-permissions-menu`}
      title={t('datasetActionButtons.editDataset.permissions.title')}
      variant="secondary">
      {dataset.permissions.canManageDatasetPermissions && (
        <DropdownButtonItem>
          {t('datasetActionButtons.editDataset.permissions.dataset')}
        </DropdownButtonItem>
      )}
      {dataset.permissions.canManageFilesPermissions && (
        <DropdownButtonItem>
          {t('datasetActionButtons.editDataset.permissions.file')}
        </DropdownButtonItem>
      )}
    </DropdownButton>
  )
}
