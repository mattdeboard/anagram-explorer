import React from "react";
import produce from "immer";
import { Button, Container } from "reactstrap";
import { InputBox, SourceBox } from ".";

export default function Controller() {
  const [{ inputDisabled, inputField, source, sourceIndex }, dispatch] =
    React.useReducer(reducer, INITIAL_STATE);
  const setSource = React.useCallback(
    (value: string) => dispatch({ type: "updateSource", value }),
    [dispatch],
  );
  const setSourceIndex = React.useCallback(
    (value: Partial<State["sourceIndex"]>) =>
      dispatch({ type: "updateSourceIndex", value }),
    [dispatch],
  );
  const setInput = React.useCallback(
    (value: string) => dispatch({ type: "updateInputField", value }),
    [dispatch],
  );
  const setInputDisabled = React.useCallback(
    (value: boolean) => dispatch({ type: "updateInputDisabled", value }),
    [dispatch],
  );
  const handleInput = React.useCallback(
    // The logic for conditional registration of keystrokes. Only keystrokes for characters that are
    // still available as choices from the source text will be registered. One exception is spaces:
    // Unlimited spaces are allowed.
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const proposedInput = event.target.value;
      const lastLetter =
        proposedInput[proposedInput.length - 1]?.toLocaleLowerCase();
      const letterInSource = Object.keys(sourceIndex).includes(lastLetter);

      if (!proposedInput.length || letterInSource) {
        if (
          inputField.length < proposedInput.length ||
          sourceIndex[lastLetter] > 0
        ) {
          setInput(proposedInput);
        }
        setSourceIndex(characterIndex(proposedInput));
      }
    },
    [inputField.length, setInput, setSourceIndex, sourceIndex],
  );

  return (
    <Container style={{ width: "50%" }}>
      <SourceBox content={source} contentIndex={sourceIndex} />
      <InputBox
        content={inputField}
        disabled={inputDisabled}
        onChange={handleInput}
      />
      <Button
        color="primary"
        onClick={async () => {
          const contents = await navigator.clipboard.readText();
          if (contents.length) {
            setSource(contents);
            setSourceIndex(characterIndex(contents));
            setInput("");
            setInputDisabled(false);
          }
        }}
      >
        Paste clipboard contents
      </Button>
      <Button
        color="secondary"
        onClick={() => {
          setSource("");
          setSourceIndex({});
          setInputDisabled(true);
        }}
      >
        Reset Source
      </Button>
    </Container>
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
  return { ...index, " ": Infinity };
}

type Action =
  | { type: "updateInputField"; value: string }
  | { type: "updateSourceIndex"; value: Partial<State["sourceIndex"]> }
  | { type: "updateSource"; value: string }
  | { type: "updateInputDisabled"; value: boolean };

type State = {
  inputDisabled: boolean;
  inputField: string;
  source: string;
  sourceIndex: Record<string, number> & { " ": number };
};

const INITIAL_STATE: State = {
  inputDisabled: true,
  inputField: "",
  source: "",
  sourceIndex: { " ": Infinity },
};

function reducer(state: State, action: Action) {
  return produce(state, draft => {
    switch (action.type) {
      case "updateInputDisabled":
        draft.inputDisabled = action.value;
        break;
      case "updateInputField":
        draft.inputField = action.value;
        break;
      case "updateSource":
        draft.source = action.value;
        break;
      case "updateSourceIndex":
        draft.sourceIndex = { ...action.value, " ": Infinity };
        break;
      default:
        return draft;
    }
  });
}
