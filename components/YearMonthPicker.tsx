import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useState } from "react";

function YearMonthPicker(props) {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <DatePicker
        views={["year"]}
        label="Year only"
        value={selectedDate}
        onChange={handleDateChange}
        animateYearScrolling
      />
    </MuiPickersUtilsProvider>
  );
}

export default YearMonthPicker;
