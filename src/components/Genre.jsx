import { h, Component } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

function GenderChart() {
  const chartRef = useRef(null);
  const [Plotly, setPlotly] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("plotly.js-dist")
        .then((Plotly) => {
          console.log("Plotly loaded:", Plotly);
          setPlotly(Plotly.default);
        })
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (Plotly) {
      console.log("Plotly is defined:", Plotly);
      const data = [
        {
          values: [179, 56],
          labels: ["Homem", "Mulher"],
          type: "pie",
          textinfo: "label+percent",
          textposition: "inside",
          automargin: true,
          marker: {
            colors: ["#2f6ec2", "#c22f2f"],
          },
          insidetextfont: {
            family: "Poppins, bold",
            size: 18,
          },
        },
      ];

      const layout = {
        title: "Gênero",
        height: 400,
        width: 500,
        margin: { t: 0, b: 0, l: 0, r: 0 },
        showlegend: false,
        paper_bgcolor: "#14161a",
        plot_bgcolor: "#1e1e1e",
        font: {
          color: "#d3d3d3",
        },
      };

      Plotly.newPlot(chartRef.current, data, layout);
    } else {
      console.log("Plotly is not defined");
    }
  }, [Plotly]);

  return <div class="has-text-centered" ref={chartRef}></div>;
}

export default GenderChart;
