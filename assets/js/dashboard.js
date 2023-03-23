Chart.register(ChartDataLabels);

//activate link by visit
let link = document.getElementsByClassName("link-box");

for (let i = 0; i < link.length; i++) {
  link[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

//open sidebar
let hamburger = document.getElementById("toggle-btn");
hamburger.addEventListener("click", ()=>{
    let nav = document.getElementsByClassName("nav-container")[0];
    if (hamburger.getAttribute("aria-expanded") === "false"){
        nav.style.left = 0;
        hamburger.setAttribute("aria-expanded", "true")
    }
})

//close sidebar
let closeBtn = document.getElementById("close-btn")
let closeSidebar = ()=>{
    let nav = document.getElementsByClassName("nav-container")[0];
    if (hamburger.getAttribute("aria-expanded") === "true"){
        nav.style.left = "-280px";
        hamburger.setAttribute("aria-expanded", "false")
    }
}
closeBtn.addEventListener("click", closeSidebar)

//close sidebar on clicking link
let asideLink = document.getElementsByClassName("aside-link")
for(let i=0; i<asideLink.length; i++){
    asideLink[i].addEventListener("click", closeSidebar)
}

//outside click for side bar
let nav = document.getElementsByClassName("nav-container")[0];      
document.addEventListener('click', function(e) {
  console.log(e.target)
  if (window.innerWidth< 998 && !nav.contains(e.target) && !hamburger.contains(e.target)) {
      closeSidebar();
  }
});


//open and close drop down list
let userDropdown = document.getElementById("user-dropdown")
userDropdown.addEventListener("click", ()=>{
    let userOptions = document.getElementById("user-options")
    if (userDropdown.getAttribute("aria-expanded") === "true"){
        userOptions.style.display="none";
        userDropdown.setAttribute("aria-expanded", "false")
    }else{
        userOptions.style.display="block";
        userDropdown.setAttribute("aria-expanded", "true") 
    }
})

//outside click for drop down
let DropBox = userDropdown.firstElementChild;
let userOptions = document.getElementById("user-options")
document.addEventListener('click', function(e) {
  if (!userDropdown.contains(e.target)) {
    if (userDropdown.getAttribute("aria-expanded") === "true"){
      userOptions.style.display="none";
      userDropdown.setAttribute("aria-expanded", "false")
  }
  }
});


//Bar graph JS
var xValues = ["School_Name_01", "School_Name_02", "School_Name_03", "School_Name_04"];
  
new Chart("bar-chart", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      label: "Active",
      backgroundColor: "#F9AC32",
      data: [150, 200, 350, 250],
      barThickness:20
    },{
        label:"Inactive",
        backgroundColor: "#EEEEEE",
        data: [200, 250, 100, 50],
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


//pie chart
var pieXValues = ["Multimedia", "Audio Notes", "Notes","Free Space"];
var pieYValues = [ 85, 115, 55, 245];
var barColors = ["#286BCB", "#7DB0F7", "#CCCCCC", "#386CB5"];

//custom data labels plugin block


new Chart("pie-chart", {
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

/*
//custom pieLabelsLine plugin
const pieLabelsLine = {
  id: "pieLabelsLine",
  afterDraw(chart) {
    const {
      ctx,
      chartArea: { width, height },
    } = chart;

    const cx = chart._metasets[0].data[0].x;
    const cy = chart._metasets[0].data[0].y;

    chart.data.datasets.forEach((dataset, i) => {
      chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
        const { x: a, y: b } = datapoint.tooltipPosition();

        const x = 2 * a - cx;
        const y = 2 * b - cy;

        // draw line
        const halfwidth = width / 2;
        const halfheight = height / 2;
        const xLine = x >= halfwidth ? x : x ;
        const yLine = y >= halfheight ? y : y;

        const extraLine = x >= halfwidth ? 10 : -10;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.moveTo(x, y);
        ctx.lineTo(xLine + extraLine, yLine);
        // ctx.strokeStyle = dataset.backgroundColor[index];
        ctx.strokeStyle = barColors[index];
        ctx.stroke();

        // text
        const textWidth = ctx.measureText(chart.data.labels[index]).width;
        ctx.font = "12px Arial";
        // control the position
        const textXPosition = x >= halfwidth ? "left" : "right";
        const plusFivePx = x >= halfwidth ? 5 : -5;
        ctx.textAlign = textXPosition;
        ctx.textBaseline = "middle";
        // ctx.fillStyle = dataset.backgroundColor[index];
        ctx.fillStyle = barColors[index];

        ctx.fillText(
          chart.data.datasets[0].data[index] + " mb ",
          xLine + extraLine + plusFivePx,
          yLine
        );
      });
    });
  },
};

new Chart("pie-chart", {
  type: "pie",
  data: {
    labels: pieXValues,
    datasets: [{
      backgroundColor: barColors,
      data: pieYValues,
      borderWidth: 6
    }]
  },
  plugins: [pieLabelsLine],
  options: {
    rotation: 45,
    plugins: {
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
        display: false,
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
*/