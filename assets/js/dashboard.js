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
var xValues = ["School Name 01", "School Name 02", "School Name 03", "School Name 04"];
  
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
      legend: {
        display: true,
        position: 'top',
        align: 'end',
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
        }
      },
  
      y: {
        stacked:true,
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
var pieYValues = [49, 17, 23, 11];
var barColors = [
  "#386CB5",
  "#286BCB",
  "#7DB0F7",
  "#CCCCCC"
];

//custom data labels plugin block


new Chart("pie-chart", {
  type: "pie",
  data: {
    labels: pieXValues,
    datasets: [{
      backgroundColor: barColors,
      data: pieYValues
    }]
  },
  options: {
    plugins: {
      datalabels: {
        formatter: (value) => {
            let sum = 0;
            let dataArr = pieYValues;
            dataArr.map(data => {
                sum += data;
            });
            let percentage = (value*100 / sum).toFixed(2)+"%";
            return percentage;
        },
        color: '#fff',
    },
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
        labels: {
            usePointStyle	: true,
            pointStyle: "circle",
            fontColor: '#333',
            boxWidth: 8,
            boxHeight: 8,
            borderRadius: "50"
        }
    },
      title: {
        display: false,
      },
    },
    responsive: true,
    aspectRatio: 2
  },
});