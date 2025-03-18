import { TextInput } from "@mantine/core";

interface InputValidation {
  value: string;
  setValue: (newState: string) => void;
  error: string;
}

export function InputValidation({ value, setValue, error }: InputValidation) {
  return (
    <TextInput
      label="👇 Enter your github username (or someone else's...) 👇"
      value={value}
      error={error}
      withErrorStyles={false}
      placeholder="your-github-account"
      onChange={(event) => setValue(event.currentTarget.value)}
      styles={{
        input: {
          backgroundColor: "bg-red-500",
          borderRadius: "8px",
          minWidth: "25vw",
          maxWidth: "80vw",
          height: "5vh",
          textAlign: "center",
          fontSize: "1.3rem",
        },
        label: {
          minWidth: "25vw",
          maxWidth: "80vw",
          fontSize: "1.1rem",
          marginBottom: "10px",
        },
        error: {
          fontSize: "1.1rem",
          marginTop: "10px",
        },
      }}
    />
  );
}
