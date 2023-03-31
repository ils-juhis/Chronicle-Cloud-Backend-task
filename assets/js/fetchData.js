
import data from '../../data/tableData.json' assert { type: 'json' };
import countData from '../../data/countData.json' assert { type: 'json' };
import graphData from '../../data/graphData.json' assert { type: 'json' };
Chart.register(ChartDataLabels);

let tableData=data["tableData"];
for (let i=0; i<tableData.length; i++) {
  document.querySelector(".school-table tbody").innerHTML += `
<tr>
<th scope="row"> <img src=${tableData[i].imgPath} alt=""></th>
  <td>${tableData[i].schoolName}</td>
  <td>${tableData[i].email}<br> ${tableData[i].phone}</td>
  <td>${tableData[i].schoolSize}</td>
  <td>${tableData[i].dataUsage}/<span class="text-mute">${tableData[i].totalData} mb</span></td>
  <td>${tableData[i].status}</td>
  <td>
      <a href=${tableData[i].viewLink} class="text-decoration-none">
          <i class="fa-solid fa-eye"></i> &nbsp; View
      </a>
  </td>
</tr>`
}

let countJSonData=countData["countData"];
for (let i=0; i<countJSonData.length; i++) {

    document.getElementById("count-box").innerHTML += `
    <div class="col-12 col-sm-6 col-xxl-3">
    <div class="count-items d-flex">
        <div>
            <div> ${countJSonData[i].heading}</div>
            <div> ${countJSonData[i].activeCases} <span>${countJSonData[i].status}</span></div>
            <div>${countJSonData[i].totalText}: ${countJSonData[i].total}</div>
        </div>
        <div class="icon">
            <i class="fa-solid"> &#x${countJSonData[i].icon} </i>
        </div>
    </div>
</div>`
  }

//select options
for(let i=0; i<graphData.allSchool.length; i++){
    document.getElementById("select-school").innerHTML += `<option value='${i}'>${graphData.allSchool[i].schoolName}</option>`
}

let selectValue = document.getElementById("select-school").value;
//pie chart
let pieXValues = ["Multimedia", "Audio Notes", "Notes","Free Space"];
let {multimedia, audioNotes, notes, free} = graphData.allSchool[selectValue];
let pieYValues = [multimedia, audioNotes, notes, free];
let barColors = ["#286BCB", "#7DB0F7", "#CCCCCC", "#386CB5"];

//custom data labels plugin block

let pieChart;
pieChart = new Chart("pie-chart", {
  type: "pie",
  data: {
    labels: pieXValues,
    datasets: [{
      backgroundColor: barColors,
      data: pieYValues,
      borderWidth: 6
    }]
  },
  options: {
    rotation: 45,
    plugins: {
      
      labels:{
        render: (ctx)=>{
          return ctx.value + " mb ";
        },
        position:"outside",
        fontColor: barColors
      },
      datalabels:{
        formatter: (value, ctx) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;
          dataArr.map(data => {
            sum += data;
          });
          let percentage = (value*100 / sum).toFixed(0)+"%";
          return percentage;
        },
        labels: {
          title: {
            font: {
              weight: 'bold'
            }
          },
        },
        color: "#FFFFFF"
      },
      legend: {
        display: true,
        position: 'left',
        align: 'end',
        labels: {
            usePointStyle	: true,
            pointStyle: "circle",
            fontColor: '#333',
            boxWidth: 10,
            boxHeight: 10,
            borderRadius: "50",
        }
    },
      title: {
        display: false,
        beginAtZero: true,
      },
      type: 'linear'
    },
    responsive: true,
    aspectRatio: 2
  },
});

document.getElementById("select-school").addEventListener('change', (e)=>{
    ({multimedia, audioNotes, notes, free} = graphData.allSchool[e.currentTarget.value])
    pieYValues = [multimedia, audioNotes, notes, free];
    pieChart.destroy();

    pieChart = new Chart("pie-chart", {
        type: "pie",
        data: {
          labels: pieXValues,
          datasets: [{
            backgroundColor: barColors,
            data: pieYValues,
            borderWidth: 6
          }]
        },
        options: {
          rotation: 45,
          plugins: {
            
            labels:{
              render: (ctx)=>{
                return ctx.value + " mb ";
              },
              position:"outside",
              fontColor: barColors
            },
            datalabels:{
              formatter: (value, ctx) => {
                let sum = 0;
                let dataArr = ctx.chart.data.datasets[0].data;
                dataArr.map(data => {
                  sum += data;
                });
                let percentage = (value*100 / sum).toFixed(0)+"%";
                return percentage;
              },
              labels: {
                title: {
                  font: {
                    weight: 'bold'
                  }
                },
              },
              color: "#FFFFFF"
            },
            legend: {
              display: true,
              position: 'left',
              align: 'end',
              labels: {
                  usePointStyle	: true,
                  pointStyle: "circle",
                  fontColor: '#333',
                  boxWidth: 10,
                  boxHeight: 10,
                  borderRadius: "50",
              }
          },
            title: {
              display: false,
              beginAtZero: true,
            },
            type: 'linear'
          },
          responsive: true,
          aspectRatio: 2
        },
      });
      
      
})




//Bar graph JS
var xValues = graphData.allSchool.map((value)=>{return value.schoolName})
console.log(xValues)
  
new Chart("bar-chart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      label: "Active",
      backgroundColor: "#F9AC32",
      data: graphData.allSchool.map((value)=>{return value.active}),
      barThickness:20,
      hoverBackgroundColor: "#5BCDA2"
    },{
        label:"Inactive",
        backgroundColor: "#EEEEEE",
        data: graphData.allSchool.map((value)=>{return value.inactive}),
        barThickness:20
    }]
  },
  options: {
    plugins: {
      datalabels:{
        display: false
      },
      legend: {
        display: true,
        position: 'right',
        align: 'start',
        labels: {
            usePointStyle	: true,
            pointStyle: "circle",
            fontColor: '#333',
            boxWidth: 6,
            boxHeight: 6,
            borderRadius: "50",
            
        },
        
    },
   
      title: {
        display: false,
      },
    },
    
    scales: {
      x:  {
        stacked:true,
        grid: {
          display: false
        },
      },
  
      y: {
        stacked:true,
        grid:{
          drawBorder: false
        },
        min: 0,
        max: 400,
        ticks: {
          // forces step size to be 50 units
          stepSize: 100
        }
      },
    },
    responsive: true,
    aspectRatio: 2
  },
});
