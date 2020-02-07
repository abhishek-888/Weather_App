import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core";

import dayjs from "dayjs";

export default function Forecast(props) {
  const result = props.forecast.map((item, index) => {
    return (
      <ListItem key={index} className="forecastItem">
        <ListItemText
          className="week-day"
          primary={dayjs(item.dt_txt).format("dddd")}
          style={{ flex: "1 1 0%", textAlign: "left" }}
        ></ListItemText>
        <span className="temp" style={{ flex: "1 1 0%", textAlign: "right" }}>
          <Typography variant="body2" component="span" color="textPrimary">
            {Math.round(item.min)}&deg; /{" "}
          </Typography>
          <Typography variant="body2" component="span" color="textSecondary">
            {Math.round(item.max)}&deg;
          </Typography>
        </span>
      </ListItem>
    );
  });

  return (
    <List component="nav" aria-label="forecast data">
      {result}
    </List>
  );
}
