import { SearchIcon } from "lucide-react";
import { ChangeEventHandler } from "react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
}) {
  return (
    <InputGroup className="max-w-2xl">
      <InputGroupInput
        value={value}
        onChange={onChange}
        placeholder="Search..."
        // className="max-w-sm"
      />
      <InputGroupAddon align="inline-start">
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}
