import React from "react";

export default function SourceBox({
  content,
  contentIndex,
}: {
  content: string;
  contentIndex: Record<string, number>;
}) {
  const [kids, setKids] = React.useState<JSX.Element[]>();
  React.useEffect(() => {
    const letters: JSX.Element[] = [];
    let counter = 0;
    for (const c of content) {
      if (contentIndex[c] && contentIndex[c] === 0) {
        // eslint-disable-next-line react/display-name
        letters.push(<InactiveLetter key={`${c}-${counter}`} char={c} />);
      } else {
        letters.push(<ActiveLetter key={`${c}-${counter}`} char={c} />);
      }
      counter++;
    }
    setKids(letters);
  }, [kids, setKids, content, contentIndex]);
  return <div>{kids}</div>;
}

function ActiveLetter({ char }: { char: string }) {
  return <span>{char}</span>;
}

function InactiveLetter({ char }: { char: string }) {
  return (
    <span>
      <s>{char}</s>
    </span>
  );
}
