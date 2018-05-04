import React from 'react';
import { shallow } from 'enzyme';
import { Doughnut } from 'react-chartjs-2';
import HealthInfo from './HealthInfo';


const propsToPass = {
  data: {
    labels: ["Fat (g)", "Carbs (g)", "Protein (g)"],
    datasets: [{
      backgroundColor: ["#FF7272", "#FFDF73", "#C4FF73"],
      data: [20, 6, 15]
    }]
  },
  options: {
    legend: {
      labels: {
        boxWidth: 20,
        fontSize: 12,
        fontFamily: "Cabin",
        fontColor: "white"
      }
    },
    responsive: true,
    maintainAspectRatio: false
  }
};

describe("RecipeItem", () => {

  let props;

  let shallowHealthInfo;

  const healthInfo = () => {
    if(!shallowHealthInfo) {
      shallowHealthInfo = shallow(<HealthInfo {...props} />);
    }

    return shallowHealthInfo;
  };

  beforeEach(() => {
    props = {
      calories: 100,
      digest: [{label: "Fat", total: 39.9}, {label: "Carbs", total: 12.3}, {label: "Protein", total: 30.5}],
      yield: 2.0
    };
    shallowHealthInfo = undefined;

  });

  it("always renders a div with class `health-info`", () => {
    expect(healthInfo().find("div.health-info").length).toBe(1);
  });

  describe("`calories` prop", () => {
    it("renders h3 element with class `.calories` when defined", () => {
      expect(healthInfo().find("h3.calories").length).toBe(1);
    });

    it("renders nothing when undefined", () => {
      props.calories = undefined;
      expect(healthInfo().find(".calories").length).toBe(0);
    });

  });

  describe("`yield` prop", () => {
    it("sets `.calories` text to '{props.calories/props.yield (rounded)} calories' when defined", () => {
      expect(healthInfo().find(".calories").text()).not.toEqual(props.calories + " calories");
      expect(healthInfo().find(".calories").text()).toEqual(Math.round(props.calories/props.yield) + " calories");
    });

    it("sets `.calories` text to '{props.calories} calories' when undefined", () => {
      props.yield = undefined;
      expect(healthInfo().find(".calories").text()).toEqual(props.calories + " calories");
      expect(healthInfo().find(".calories").text()).not.toEqual(Math.round(props.calories/props.yield) + " calories");
    });
  });

  describe("`digest` prop", () => {

    it("renders a `Doughnut` component when defined", () => {
      expect(healthInfo().find(Doughnut).length).toBe(1);
    });

    it("passes the correct props to the `Dougnut` component", () => {
      expect(healthInfo().find(Doughnut).get(0).props).toEqual(propsToPass);
    });

    describe("when `yield` prop is undefined", () => {
      it("passes the correct props to `Doughnut` component", () => {
        props.yield = undefined;
        propsToPass.data.datasets[0].data = [40, 12, 31];
        expect(healthInfo().find(Doughnut).get(0).props).toEqual(propsToPass);
      });
    });

    it("does not render a `Doughnut` component when undefined", () => {
      props.digest = undefined;
      expect(healthInfo().find(Doughnut).length).toBe(0);
    });

    it("renders a `p` element with correct text when undefined", () => {
      props.digest = undefined;
      expect(healthInfo().find("p").length).toBe(1);
      expect(healthInfo().find("p").text()).toEqual("No additional health information.");
    });
  });

});
