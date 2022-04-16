import React from "react";
import "./App.css";
import { isEqual } from "lodash";
import { Button, Container } from "reactstrap";
import { InputBox, SourceBox } from "./components";

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
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const proposedInput = event.target.value;
      console.log(event.type);
      const lastLetter = proposedInput[proposedInput.length - 1];
      if (
        !proposedInput.length ||
        (Object.keys(sourceIndex).includes(lastLetter) &&
          sourceIndex[lastLetter] > 0)
      ) {
        setInput(proposedInput);
        setInputIndex(characterIndex(proposedInput));

        if (proposedInput.length > input.length)
          setSourceIndex(prev => {
            return {
              ...prev,
              [lastLetter]: prev[lastLetter] - 1,
            };
          });
      } else {
        setSourceIndex(prev => ({
          ...prev,
          [lastLetter]: prev[lastLetter] + 1,
        }));
      }
    },
    [input, sourceIndex, setInput, setInputIndex],
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
        <SourceBox content={source} contentIndex={sourceIndex} />
        <InputBox
          content={input}
          disabled={inputDisabled}
          onChange={handleInput}
          source={source}
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
  for (const c of s.toLocaleLowerCase()) {
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
