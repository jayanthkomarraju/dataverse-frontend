import { Form } from '@iqss/dataverse-design-system'

interface Props {
  name: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  isInvalid: boolean
  disabled: boolean
}
//TODO:ME  Add validation for floating numbers?
export const FloatField = ({ name, onChange, isInvalid, disabled, ...props }: Props) => {
  return (
    <Form.Group.Input
      type="text"
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      data-testid="float-field"
      {...props}
    />
  )
}
