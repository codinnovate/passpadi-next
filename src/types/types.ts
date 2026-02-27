import { Control, FieldValues, Path } from "react-hook-form";

export enum FormFieldType {
  INPUT = "input",
  SELECT = "select",
  MULTI_SELECT = "multi_select",
  TEXTAREA = "textarea",
}

export interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: React.ReactNode;
  inputType?: string;
  fieldType: FormFieldType;
  options?: { label: string; value: string }[];
  disabled?: boolean;
}
