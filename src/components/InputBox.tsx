import React from "react";
import { FormGroup, Label, Input, Form } from "reactstrap";

export default function InputBox({
  content,
  disabled,
  onChange,
  source,
}: {
  content: string;
  disabled: boolean;
  onChange?: React.ChangeEventHandler;
  source: string;
}) {
  return (
    <div>
      <Form>
        <FormGroup>
          <Label for="inputArea">Text Area</Label>
          <Input
            disabled={disabled}
            id="inputArea"
            name="text"
            onChange={event => {
              if (onChange) {
                onChange(event);
              }
            }}
            type="textarea"
            value={content}
          />
        </FormGroup>
      </Form>
    </div>
  );
}
