import {
  Container,
  createStyles,
  FormControl,
  InputLabel,
  makeStyles,
  Select,
  Theme,
  CircularProgress,
  Typography
} from "@material-ui/core";
import React from "react";
import "./App.css";
import QrReader from "react-qr-reader";
import { checkin } from "./firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      "margin-top": theme.spacing(2),
      "margin-bottom": theme.spacing(1)
    },
    overlayBackground: {
      position: "fixed",
      width: "100%",
      height: "100%",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      textAlign: "center"
    },
    overlayContent: {
      position: "fixed",
      top: "50%",
      bottom: "50%",
      width: "100%"
    }
  })
);

const App: React.FunctionComponent = () => {
  const classes = useStyles();
  const [state, setState] = React.useState<{
    hackathon: string;
    event: string | undefined;
    loading: boolean;
    success: boolean;
    failure: boolean;
  }>({
    hackathon: "GrizzHacks4",
    event: undefined,
    loading: false,
    success: false,
    failure: false
  });

  const hackathonLabel = React.useRef<HTMLLabelElement>(null);
  const eventLabel = React.useRef<HTMLLabelElement>(null);
  const [hackathonLabelWidth, setHackathonLabelWidth] = React.useState(0);
  const [eventLabelWidth, setEventLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setHackathonLabelWidth(hackathonLabel.current!.offsetWidth);
    setEventLabelWidth(eventLabel.current!.offsetWidth);
  }, []);

  const handleChange = (name: keyof typeof state) => (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setState({
      ...state,
      [name]: event.target.value
    });
  };

  const handleScan = (data: string | null) => {
    if (
      state.hackathon &&
      state.event &&
      data &&
      !state.loading &&
      !state.success &&
      !state.failure
    ) {
      console.log(data);
      data = data.replace(/[\\/]/g, "_");
      setState({
        ...state,
        loading: true
      });
      const checking = checkin({
        hackathon: state.hackathon,
        event: state.event,
        id: data
      });
      checking.then(results => {
        results ? displaySuccess() : displayFailure();
      });
    }
  };

  const displayTime = 1000;
  const displayFailure: () => void = () => {
    console.log("failure");
    setState({
      ...state,
      loading: false,
      failure: true
    });
    setTimeout(() => {
      setState({
        ...state,
        failure: false
      });
    }, displayTime);
  };
  const displaySuccess: () => void = () => {
    console.log("success");
    setState({
      ...state,
      loading: false,
      success: true
    });
    setTimeout(() => {
      setState({
        ...state,
        success: false
      });
    }, displayTime);
  };

  return (
    <Container>
      <FormControl variant="outlined" className={classes.formControl} fullWidth>
        <InputLabel ref={hackathonLabel} htmlFor="hackaton-select">
          Hackathon
        </InputLabel>
        <Select
          native
          value={state.hackathon}
          onChange={handleChange("hackathon")}
          labelWidth={hackathonLabelWidth}
          inputProps={{
            name: "hackathon",
            id: "hackathon-select"
          }}
        >
          <option value={"GrizzHacks4"}>GrizzHacks4</option>
        </Select>
      </FormControl>
      {!!state.hackathon && (
        <FormControl
          variant="outlined"
          className={classes.formControl}
          fullWidth
        >
          <InputLabel ref={eventLabel} htmlFor="event-select">
            Event
          </InputLabel>
          <Select
            native
            value={state.event}
            onChange={handleChange("event")}
            labelWidth={eventLabelWidth}
            inputProps={{
              name: "event",
              id: "event-select"
            }}
          >
            <option value="" />
            <option value={10}>Ten</option>
            <option value={20}>Twenty</option>
            <option value={30}>Thirty</option>
          </Select>
        </FormControl>
      )}
      {!!state.event && (
        <QrReader
          className={classes.formControl}
          delay={300}
          onError={() => {
            alert("Unable to read QR Code");
          }}
          onScan={data => handleScan(data)}
          style={{ width: "100%" }}
        />
      )}
      {!!state.loading && (
        <div className={classes.overlayBackground} id="loading">
          <CircularProgress className={classes.overlayContent} />
        </div>
      )}
      {!!state.success && (
        <div className={classes.overlayBackground} id="success">
          <Typography className={classes.overlayContent} variant="h3">
            Success!
          </Typography>
        </div>
      )}
      {!!state.failure && (
        <div className={classes.overlayBackground} id="failure">
          <Typography className={classes.overlayContent} variant="h3">
            Error! Try again!
          </Typography>
        </div>
      )}
    </Container>
  );
};

export default App;
