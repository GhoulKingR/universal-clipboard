import { Grid } from "@mui/material";
import React from "react";

function Text() {
  return (
    <Grid item xs={12} sm={6}>
      <p>
        I switched from an iPhone to an Android recently. After the switch, the
        ecosystem benefit that I miss the most is universal copy/paste between
        Apple devices.
      </p>
      <br />
      <p>
        I got inspired to build an app that let's users closely mimic this
        functionality. If it's not going to be as powerful, at least it should
        give users the ability to copy text between devices fairly seamlessly.
      </p>
      <br />
      <p>
        This app greatly reduces the time an effort needed to send a message to
        yourself, or to store the text in a shared documenting app.
      </p>
      <br />
      <p>
        This app may not be as powerful as the universal copy/paste between
        Apple devices, but I know I will use it very often.
      </p>
    </Grid>
  );
}

export default Text;
