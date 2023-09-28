import { User, signOut } from "@firebase/auth";
import { Logout } from "@mui/icons-material";
import { Button, Container } from "@mui/material";
import React, { CSSProperties } from "react";
import styled from "styled-components";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

type InputType = {
  user: User;
};

function Header({ user }: InputType) {
  const navigate = useNavigate();

  const signout = () => {
    // sign user out then navigate to home page
    signOut(auth)
      .then(() => navigate("/"))
      .catch(console.error);
  };

  const head: CSSProperties = {
    display: "flex",
  };

  return (
    <Head className="border-solid border-b-2 mb-[30px]">
      <Container
        className="items-center justify-between flex-row p-[10px]"
        style={head}
      >
        <div className="text-2xl flex items-center">
          {user ? (
            <>
              <img
                src={user?.photoURL}
                alt="Profile"
                className="h-[50px] mr-[15px] rounded-full border-solid border-2"
              />
              {user?.displayName.toUpperCase()}
            </>
          ) : (
            <>
              <Loading width="50px" height="50px" />
              <div className="mr-[15px]" />
              <Loading width="125px" height="30px" />
              <div className="mr-[5px]" />
              <Loading width="125px" height="30px" />
            </>
          )}
        </div>
        <Button color="error" onClick={() => signout()}>
          <div className="hidden sm:inline mr-[10px]">signout </div>
          <Logout />
        </Button>
      </Container>
    </Head>
  );
}

const Head = styled.div`
  width: 100%;
  position: sticky;
  top: 0px;
  left: 0px;
`;

export default Header;
