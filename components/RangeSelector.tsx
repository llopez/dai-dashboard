import { useState } from "react"
import { Dropdown, DropdownButton } from "react-bootstrap"

interface RangeSelectorProps {
  defaultValue: number
  onChange?: (range: number) => void
}

export const RangeSelector = (props: RangeSelectorProps) => {
  const { defaultValue, onChange } = props

  const [range, setRange] = useState(defaultValue)

  const title = range < 365 ? `${range} days` : '1 year'

  const handleSelect = (value: number) => {
    setRange(value)
    onChange?.(value)
  }

  return (
    <DropdownButton title={title}>
      <Dropdown.Item onClick={() => { handleSelect(30) }}>30 days</Dropdown.Item>
      <Dropdown.Item onClick={() => { handleSelect(90) }}>90 days</Dropdown.Item>
      <Dropdown.Item onClick={() => { handleSelect(180) }}>180 days</Dropdown.Item>
      <Dropdown.Item onClick={() => { handleSelect(365) }}>1 year</Dropdown.Item>
    </DropdownButton>
  )

}
