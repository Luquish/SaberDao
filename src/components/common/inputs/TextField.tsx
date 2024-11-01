import type { FieldHookConfig } from "formik";
import { useField } from "formik";

import { InputText } from "./InputText";
import type { Props as LabeledInputProps } from "./LabeledInput";
import { LabeledInput } from "./LabeledInput";

type Props = FieldHookConfig<string> &
  Omit<LabeledInputProps<HTMLInputElement>, "Component">;

export const TextField = (props: Props) => {
  const [field, meta] = useField<string>(props);
  return (
    <LabeledInput
      Component={InputText}
      type="text"
      touched={meta.touched}
      error={meta.error}
      {...field}
      {...props}
    />
  );
};
