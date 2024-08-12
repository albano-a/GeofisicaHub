import { h, Component } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

function AgeChart() {
  const chartRef = useRef(null);
  const [Plotly, setPlotly] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("plotly.js-dist")
        .then((Plotly) => {
          setPlotly(Plotly.default);
        })
        .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (Plotly) {
      const data = [
        {
          values: [35, 94, 61, 24, 8, 13],
          labels: [
            "16 A 19 Anos",
            "20 A 23 Anos",
            "24 A 27 Anos",
            "28 A 31 Anos",
            "32 A 35 Anos",
            "Acima De 35 Anos",
          ],
          type: "pie",
          textinfo: "label+percent",
          textposition: "inside",
          automargin: true,
          marker: {
            colors: [
              "#2f6ec2",
              "#c22f2f",
              "#2fc28e",
              "#c2a22f",
              "#8e2fc2",
              "#c22f8e",
            ],
          },
          insidetextfont: {
            family: "Poppins, bold",
            size: 18,
          },
        },
      ];

      const layout = {
        title: "Idade",
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
    }
  }, [Plotly]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div ref={chartRef}></div>
    </div>
  );
}

export default AgeChart;
