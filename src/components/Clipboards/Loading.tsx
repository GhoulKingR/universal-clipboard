import React from "react";

type Input = {
  width: string;
  height: string;
};

function Loading({ width, height }: Input) {
  return (
    <div className="bg-slate-300 rounded-full" style={{ width, height }}></div>
  );
}

export default Loading;
