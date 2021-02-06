import * as React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import LoginButton from "./LoginButton";

export default class Navigation extends React.Component {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { children } = this.props;
    const { open } = this.state;
    return (
      <div>
        <AppBar position="static" elevation={0}>
          <Toolbar
            variant="dense"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            Frontier
            <LoginButton />
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <div style={{ height: "calc(100vh - 50px)" }}>{children}</div>
      </div>
    );
  }
}
