import {
  createStyles,
  Navbar,
  getStylesRef,
  Title,
  MantineProvider,
  Group,
} from "@mantine/core";
import "./ChatSideBar.css";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: [
      "#7AD1DD",
      "#5FCCDB",
      "#44CADC",
      "#2AC9DE",
      "#1AC2D9",
      "#11B7CD",
      "#09ADC3",
      "#0E99AC",
      "#128797",
      "#147885",
    ],
  },
  title: {
    display: "flex",
    alignItems: "center",
    fontSize: "2rem",
    color: theme.white,
    fontWeight: 900,
    paddingBottom: theme.spacing.xs,
  },
  h1: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: "1.8rem",

    color: theme.white,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 900,

    "&:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          ?.background,
        0.1
      ),
    },
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.white,
    opacity: 0.75,
    marginRight: theme.spacing.sm,
  },
  h1Active: {
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.fn.variant({ variant: "filled", color: theme.primaryColor })
          ?.background,
        0.15
      ),
      [`& .${getStylesRef("icon")}`]: {
        opacity: 0.9,
      },
    },
  },
}));
const ChatSideBar = (props) => {
  const [active, setActive] = useState();
  const { classes, cx } = useStyles();

  let allFriends = props.friends;
  props.activeUser(active);
  return (
    <>
      <MantineProvider
        theme={{
          fontFamily: "Verdana, sans-serif",
          fontFamilyMonospace: "Monaco, Courier, monospace",
          headings: {
            fontFamily: "Greycliff CF, sans-serif",
          },
          colors: {
            "ocean-blue": [
              "#7AD1DD",
              "#5FCCDB",
              "#44CADC",
              "#2AC9DE",
              "#1AC2D9",
              "#11B7CD",
              "#09ADC3",
              "#0E99AC",
              "#128797",
              "#147885",
            ],
          },
        }}
      >
        <Navbar width={{ sm: 300 }} p="md" className={classes.navbar}>
          <Navbar.Section>
            <Title order={1} className={classes.title}>
              Chats
            </Title>
          </Navbar.Section>
          {allFriends.map((friend) => {
            return (
              <Navbar.Section>
                <Title
                  className={cx(classes.h1, {
                    [classes.h1Active]: friend.name === active,
                  })}
                  key={friend._id}
                  onClick={() => {
                    //event.preventDefault();
                    setActive(friend.name);
                  }}
                  order={2}
                >
                  {friend.name}
                </Title>
              </Navbar.Section>
            );
          })}
        </Navbar>
        {/* <div > */}
      </MantineProvider>
    </>
  );
};

export default ChatSideBar;
