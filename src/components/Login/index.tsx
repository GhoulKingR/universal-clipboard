import { useEffect } from "react";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Container, Grid } from "@mui/material";
import Screenshot from "../../assets/Screenshot.png";
import Text from "./Text";
import ButtonComponent from "./Button";
import Title from "./Title";

type InputType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

function App({ setUser, user }: InputType) {
  // Monitor the user state to take the user to the
  // `/clipboard` page if they're logged in
  const navigate = useNavigate();
  useEffect(() => {
    if (user !== null) {
      navigate("/clipboards");
    }
  }, [user, navigate]);

  return (
    <Container>
      <Grid container className="p-[20px]">
        <Title text="Universal Clipboard" />
        <Text />
        <ButtonComponent setUser={setUser} />
        <Title text="How to use this app" />
        <Grid item>
          <p>
            If you have a text that you want to copy in the other device, just
            log into the account on that device you had the text in and paste it
            into the text bar in the app dashboard. If you log in to your
            account on another device, you'll see that text right underneath the
            text bar.
          </p>
        </Grid>
        <Grid item>
          <img src={Screenshot} className="pt-[50px] pd-[50px]" />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
