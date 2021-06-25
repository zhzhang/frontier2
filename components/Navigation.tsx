import { useAuth } from "@/lib/firebase";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import LoginButton from "./LoginButton";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Navigation = () => {
  const { user, loading } = useAuth();
  const classes = useStyles();
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar variant="dense">
        <Typography variant="h6" className={classes.title}>
          Frontier
        </Typography>
        <Button variant="text" href="/articles">
          Articles
        </Button>
        <Button variant="text" href="/organizations">
          Organizations
        </Button>
        <Button variant="text" href="/new-article">
          Submit
        </Button>
        {user === undefined || loading ? (
          <LoginButton />
        ) : (
          <IconButton
            edge="end"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
