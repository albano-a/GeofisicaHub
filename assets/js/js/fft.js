let myChart;

function processSignal() {
    // Get the input signal from the text field
    const inputSignal = document.getElementById('inputSignal').value;
  
    // Convert the comma-separated string to an array of numbers
    const signal = inputSignal.split(',').map(Number);
  
    // Apply FFT to the signal
    const fftResult = math.fft(signal);
  
    // Extract the magnitudes of the FFT result
    const magnitudes = math.abs(fftResult);
  
    // Prepare the data for the plot
    const data = {
      labels: [...Array(signal.length).keys()],
      datasets: [
        {
          label: 'FFT Magnitudes',
          data: magnitudes,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
    
    if (myChart) {
        myChart.destroy();
    }
    // Create a new chart
    const ctx = document.getElementById('fftChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...Array(signal.length).keys()],
            datasets: [{
                label: 'Sinal Inserido',
                data: signal,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }, {
                label: 'Magnitudes do FFT',
                data: magnitudes,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Magnitude'
                    }
                }
            }
        }
    });
  
    // Display the FFT result in an alert
    document.getElementById('fftResult').innerText = `FFT Result: ${fftResult}`;
    document.getElementById('reloadButton').addEventListener('click', processSignal);
  }