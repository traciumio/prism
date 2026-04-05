type Props = {
  codeLines: string[];
  activeLine: string; // e.g. "Main.java:7"
  isLive: boolean;
};

export function CodeViewer({ codeLines, activeLine, isLive }: Props) {
  return (
    <div className="code-frame">
      <div className="code-head">
        <span>Main.java</span>
        <span>Line synced to selected step</span>
      </div>
      <div className="code-body">
        {codeLines.map((line, idx) => {
          const lineNum = idx + 1;
          const isActive = isLive
            ? activeLine?.includes(`:${lineNum}`)
            : line.startsWith(activeLine.split(":")[1]);
          return (
            <div key={idx} className={isActive ? "code-line active" : "code-line"}>
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}
