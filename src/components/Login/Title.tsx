import { Grid } from "@mui/material";
import React from "react";

type Input = {
  text: string;
};

function Title({ text }: Input) {
  return (
    <Grid item xs={12} className="text-center">
      <h1 className="text-3xl p-[50px]">{text}</h1>
    </Grid>
  );
}

export default Title;
