import React, { ChangeEvent } from "react";
import "./App.css";
import { isEqual } from "lodash";
import { Button, Container } from "reactstrap";
import { InputBox } from "./components";

function App() {
  const [source, setSource] = React.useState<string>("");
  const [sourceIndex, setSourceIndex] = React.useState<Record<string, number>>(
    characterIndex(source),
  );
  const [input, setInput] = React.useState<string>("");
  const [inputIndex, setInputIndex] = React.useState<Record<string, number>>(
    characterIndex(input),
  );
  const [inputDisabled, setInputDisabled] = React.useState(true);

  const handleInput = React.useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const proposedInput = event.target.value;

      if (
        !proposedInput.length ||
        Object.keys(sourceIndex).includes(
          proposedInput[proposedInput.length - 1],
        )
      ) {
        setInput(proposedInput);
        setInputIndex(characterIndex(proposedInput));
      }
    },
    [sourceIndex, setInput, setInputIndex],
  );
  React.useEffect(() => {
    const newIndex = characterIndex(input);
    if (!isEqual(newIndex, inputIndex)) {
      setInputIndex(newIndex);
    }
  }, [input, setInputIndex, inputIndex, inputDisabled]);
  return (
    <div className="App">
      <Container>
        <InputBox content={source} disabled={true} />
        <InputBox
          content={input}
          disabled={inputDisabled}
          setContent={handleInput}
        />
        <Button
          color="primary"
          onClick={async () => {
            const contents = await navigator.clipboard.readText();

            if (contents.length) {
              setSource(contents);
              setSourceIndex(characterIndex(contents));
              setInputDisabled(false);
            }
          }}
          size="lg"
        >
          Paste clipboard contents
        </Button>
      </Container>
    </div>
  );
}

function characterIndex(s: string) {
  const index: Record<string, number> = {};
  for (const c of s) {
    // This is unusual convention to me, but apparently some harmful bugs can come from invoking
    // `hasOwnProperty` directly. I don't think this code is a case where this would wind up being
    // an issue, but it's a novel-enough thing to learn that I'm leaving it changes to help me
    // remember.
    //
    // https://eslint.org/docs/rules/no-prototype-builtins for more info.
    index[c] = Object.prototype.hasOwnProperty.call(index, c)
      ? index[c] + 1
      : 1;
  }
  return index;
}
export default App;
