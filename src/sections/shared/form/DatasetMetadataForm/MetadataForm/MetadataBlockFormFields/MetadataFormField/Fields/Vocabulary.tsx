import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Form, Row, Col } from '@iqss/dataverse-design-system'
import { MetadataFieldsHelper } from '../../../../MetadataFieldsHelper'
import { type CommonFieldProps } from '..'
import styles from '../index.module.scss'

interface VocabularyProps extends CommonFieldProps {
  metadataBlockName: string
  options: string[]
  withinMultipleFieldsGroup: boolean
  compoundParentName?: string
  fieldsArrayIndex?: number
}
export const Vocabulary = ({
  name,
  compoundParentName,
  metadataBlockName,
  rulesToApply,
  description,
  title,
  options,
  withinMultipleFieldsGroup,
  fieldsArrayIndex
}: VocabularyProps) => {
  const { control } = useFormContext()

  const builtFieldName = useMemo(
    () =>
      MetadataFieldsHelper.defineFieldName(
        name,
        metadataBlockName,
        compoundParentName,
        fieldsArrayIndex
      ),
    [name, metadataBlockName, compoundParentName, fieldsArrayIndex]
  )

  return (
    <Controller
      name={builtFieldName}
      control={control}
      rules={rulesToApply}
      render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
        <Form.Group controlId={builtFieldName} as={withinMultipleFieldsGroup ? Col : Row}>
          <Form.Group.Label
            message={description}
            required={Boolean(rulesToApply?.required)}
            column={!withinMultipleFieldsGroup}
            className={styles['field-label']}
            sm={3}>
            {title}
          </Form.Group.Label>
          <Col sm={withinMultipleFieldsGroup ? 12 : 9}>
            <Row>
              <Col sm={withinMultipleFieldsGroup ? 12 : 9}>
                <Form.Group.Select
                  onChange={onChange}
                  value={value as string}
                  isInvalid={invalid}
                  ref={ref}>
                  <option value="">Select</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Group.Select>
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            </Row>
          </Col>
        </Form.Group>
      )}
    />
  )
}
