import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "./input";
import { Controller, type ControllerProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Textarea } from "./textarea";

interface FormInputProps extends React.ComponentProps<"input"> {
  name: string;
  control: any;
  label: string;
  description?: string;
  controllerProps?: Omit<ControllerProps, "render">;
  fieldProps?: React.ComponentPropsWithoutRef<typeof Field>;
  fieldLabelProps?: React.ComponentPropsWithoutRef<typeof FieldLabel>;
  fieldDescriptionProps?: React.ComponentPropsWithoutRef<
    typeof FieldDescription
  >;
  fieldErrorProps?: React.ComponentPropsWithoutRef<typeof FieldError>;
  showErrors?: boolean;
}

function FormInput({
  className,
  name,
  control,
  label,
  description,
  controllerProps,
  fieldProps,
  fieldLabelProps,
  fieldDescriptionProps,
  fieldErrorProps,
  showErrors = true,
  children,
  ...props
}: FormInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      {...controllerProps}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} {...fieldProps}>
          <FieldLabel htmlFor={props.id} {...fieldLabelProps}>
            {label}
          </FieldLabel>
          <Input
            {...field}
            aria-invalid={fieldState.invalid}
            {...props}
            className={cn("h-12 border border-border", className)}
          />
          {description && (
            <FieldDescription {...fieldDescriptionProps}>
              {description}
            </FieldDescription>
          )}
          {children}
          {showErrors && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} {...fieldErrorProps} />
          )}
        </Field>
      )}
    />
  );
}

export interface FormTextareaProps extends React.ComponentProps<"textarea"> {
  name: string;
  control: any;
  label?: string;
  description?: string;
  controllerProps?: Omit<ControllerProps, "render">;
  fieldProps?: React.ComponentPropsWithoutRef<typeof Field>;
  fieldLabelProps?: React.ComponentPropsWithoutRef<typeof FieldLabel>;
  fieldDescriptionProps?: React.ComponentPropsWithoutRef<
    typeof FieldDescription
  >;
  fieldErrorProps?: React.ComponentPropsWithoutRef<typeof FieldError>;
  showErrors?: boolean;
}

function FormTextarea({
  className,
  name,
  control,
  label,
  description,
  controllerProps,
  fieldProps,
  fieldLabelProps,
  fieldDescriptionProps,
  fieldErrorProps,
  showErrors = true,
  children,
  ...props
}: FormTextareaProps) {
  return (
    <Controller
      name={name}
      control={control}
      {...controllerProps}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} {...fieldProps}>
          {label && (
            <FieldLabel htmlFor={props.id} {...fieldLabelProps}>
              {label}
            </FieldLabel>
          )}
          <Textarea
            {...field}
            aria-invalid={fieldState.invalid}
            {...props}
            className={cn("h-32 resize-none border border-border", className)}
          />
          {description && (
            <FieldDescription {...fieldDescriptionProps}>
              {description}
            </FieldDescription>
          )}
          {children}
          {showErrors && fieldState.invalid && (
            <FieldError errors={[fieldState.error]} {...fieldErrorProps} />
          )}
        </Field>
      )}
    />
  );
}

export { FormInput, FormTextarea };
