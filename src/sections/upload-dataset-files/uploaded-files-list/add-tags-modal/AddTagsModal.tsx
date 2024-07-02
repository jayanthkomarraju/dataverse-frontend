import { Button, Col, Form, Modal, Badge } from '@iqss/dataverse-design-system'
import styles from './AddTagsModal.module.scss'
import { FormEvent, useState, KeyboardEvent, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, X } from 'react-bootstrap-icons'

interface AddTagsModalProps {
  show: boolean
  availableTags: string[]
  setTagOptions: (newTags: string[]) => void
  update: (res: AddTagsModalResult) => void
}

export interface AddTagsModalResult {
  saved: boolean
  tags: string[]
}

export function AddTagsModal({ show, availableTags, setTagOptions, update }: AddTagsModalProps) {
  const { t } = useTranslation('uploadDatasetFiles')
  const [tagsToAdd, setTagsToAdd] = useState<string[]>([])
  const [tag, setTag] = useState('')
  const handleClose = (saved: boolean) => {
    update({ saved: saved, tags: tagsToAdd })
    setTagsToAdd([])
  }
  const tagsSelectId = useId()
  const addTagOption = () => {
    if (tag && !availableTags.includes(tag)) {
      setTagOptions([...availableTags, tag])
      setTagsToAdd((current) => [...current, tag])
      setTag('')
    }
  }
  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTagOption()
      event.preventDefault()
    }
  }
  return (
    <Modal show={show} onHide={() => handleClose(false)} size="lg">
      <Modal.Header>
        <Modal.Title>{t('addTags.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.add_tags_form}>
          <Form>
            <Form.Group>
              <Form.Group.Label column sm={3} htmlFor={tagsSelectId}>
                {t('fileForm.tags')}
              </Form.Group.Label>
              <Col sm={9} className={styles.tags}>
                <div className={styles.tags_select} title={t('addTags.selectTags')}>
                  {tagsToAdd.map((o) => (
                    <span
                      key={o}
                      onClick={() => setTagsToAdd(tagsToAdd.filter((x) => x !== o))}
                      data-testid="tag-to-add">
                      <Badge variant="primary">
                        {o}
                        <X />
                      </Badge>
                    </span>
                  ))}
                </div>
              </Col>
            </Form.Group>
            <Form.Group>
              <Form.Group.Label column sm={3}>
                {t('tags.customFileTag')}
              </Form.Group.Label>
              <Col sm={9}>
                <div className={styles.tag_info}>{t('tags.creatingNewTag')}</div>
                <div className="input-group mb-3" onKeyDown={handleEnter}>
                  <Form.Group.Input
                    type="text"
                    placeholder={t('tags.addNewTag')}
                    value={tag}
                    title={t('addTags.customTag')}
                    onChange={(event: FormEvent<HTMLInputElement>) =>
                      setTag(event.currentTarget.value)
                    }
                  />
                  <Button
                    className={styles.apply_button}
                    variant="secondary"
                    type="button"
                    {...{ size: 'sm' }}
                    withSpacing
                    onClick={addTagOption}>
                    {t('tags.apply')}
                  </Button>
                </div>
                <div className={styles.tag_info}>
                  {t('tags.availableTagOptions')}
                  <div>
                    {availableTags.map((o) => (
                      <span
                        key={o}
                        onClick={() => {
                          if (!tagsToAdd.includes(o)) setTagsToAdd([...tagsToAdd, o])
                        }}
                        data-testid={o}>
                        <Badge variant="secondary">
                          {o}
                          <Plus />
                        </Badge>
                      </span>
                    ))}
                  </div>
                </div>
              </Col>
            </Form.Group>
          </Form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => handleClose(true)}
          disabled={tagsToAdd.length === 0}
          title={t('addTags.saveChanges')}>
          {t('addTags.saveChanges')}
        </Button>
        <Button
          variant="secondary"
          onClick={() => handleClose(false)}
          title={t('addTags.cancelChanges')}>
          {t('addTags.cancelChanges')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
