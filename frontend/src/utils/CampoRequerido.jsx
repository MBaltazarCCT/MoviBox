import React from 'react'
import { Form } from 'react-bootstrap'

function CampoRequerido(text) {
  return (
    <Form.Label className="text-muted">
      {text} <span className="text-danger">*</span>
    </Form.Label>
  )
}

export default CampoRequerido