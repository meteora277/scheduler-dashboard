import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import axios from "axios";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {
  state = {
    loading: true,
    focused: null,
    days: [],
    appointments: {},
    interviewers: {}
  };

  selectPanel = (id) => {
    this.setState((prev) => ({ focused: prev.focused !== null ? null : id }));
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({ focused });
    }

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      const [days, appointments, interviewers] = all
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      })
    })


  }

  componentDidUpdate(prevState) {
    if (prevState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused))
    }
  }

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
    });
    const panels = data
      .filter((panel) => {
        return this.state.focused === null || this.state.focused === panel.id;
      })
      .map((panel) => {
        return (
          <Panel
            key={panel.id}
            label={panel.label}
            value={panel.value}
            onSelect={() => this.selectPanel(panel.id)}
          />
        );
      });
    return (
      <section>
        {this.state.loading ? (
          <Loading />
        ) : (
          <main className={dashboardClasses}>{panels}</main>
        )}
      </section>
    );
  }
}

export default Dashboard;
