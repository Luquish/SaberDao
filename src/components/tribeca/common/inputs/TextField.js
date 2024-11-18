import { useField } from "formik";
import React from "react";
import { InputText } from "./InputText";
import { LabeledInput } from "./LabeledInput";
export const TextField = (props) => {
    const [field, meta] = useField(props);
    return (React.createElement(LabeledInput, { Component: InputText, type: "text", touched: meta.touched, error: meta.error, ...field, ...props }));
};
