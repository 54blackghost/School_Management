'use strict';

document.addEventListener('DOMContentLoaded', function () {

	function generateData(baseval, count, yrange) {
		var i = 0;
		var series = [];
		while (i < count) {
			var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;;
			var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
			var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

			series.push([x, y, z]);
			baseval += 86400000;
			i++;
		}
		return series;
	}


	// Column chart
    if (document.querySelector('#sales_chart')) {
    	var columnCtx = document.getElementById("sales_chart"),
    	columnConfig = {
    		colors: ['#7c3aed', '#f39c12'],
    		series: [
    			{
    			name: "Received",
    			type: "column",
    			data: [70, 150, 80, 180, 150, 175, 201, 60, 200, 120, 190, 160, 50]
    			},
    			{
    			name: "Pending",
    			type: "column",
    			data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16, 80]
    			}
    		],
    		chart: {
    			type: 'bar',
    			fontFamily: 'Poppins, sans-serif',
    			height: 350,
    			toolbar: {
    				show: false
    			}
    		},
    		plotOptions: {
    			bar: {
    				horizontal: false,
    				columnWidth: '60%',
    				endingShape: 'rounded'
    			},
    		},
    		dataLabels: {
    			enabled: false
    		},
    		stroke: {
    			show: true,
    			width: 2,
    			colors: ['transparent']
    		},
    		xaxis: {
    			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    		},
    		yaxis: {
    			title: {
    				text: '$ (thousands)'
    			}
    		},
    		fill: {
    			opacity: 1
    		},
    		tooltip: {
    			y: {
    				formatter: function (val) {
    					return "$ " + val + " thousands"
    				}
    			}
    		}
    	};
    	var columnChart = new ApexCharts(columnCtx, columnConfig);
    	columnChart.render();
    }

	//Pie Chart
    if (document.querySelector('#invoice_chart')) {
    	var pieCtx = document.getElementById("invoice_chart"),
    	pieConfig = {
    		colors: ['#7c3aed', '#e7515a', '#f39c12', '#12b3b3'],
    		series: [55, 40, 20, 10],
    		chart: {
    			fontFamily: 'Poppins, sans-serif',
    			height: 350,
    			type: 'donut',
    		},
    		labels: ['Paid', 'Unpaid', 'Overdue', 'Draft'],
    		legend: {show: false},
    		responsive: [{
    			breakpoint: 480,
    			options: {
    				chart: {
    					width: 200
    				},
    				legend: {
    					position: 'bottom'
    				}
    			}
    		}]
    	};
    	var pieChart = new ApexCharts(pieCtx, pieConfig);
    	pieChart.render();
	}
	
	// Simple Line
    if (document.querySelector('#s-line')) {
    var sline = {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false,
        }
      },
      // colors: ['#3577f1'],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      series: [{
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
      }],
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f1f2f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    }

    var chart = new ApexCharts(
      document.querySelector("#s-line"),
      sline
    );

    chart.render();
    }


// Simple Line Area
 if (document.querySelector('#s-line-area')) {
var sLineArea = {
    chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        }
    },
    // colors: ['#3577f1', '#888ea8'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    series: [{
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100]
    }, {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41]
    }],

    xaxis: {
        type: 'datetime',
        categories: ["2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00", "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00", "2018-09-19T06:30:00"],                
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    }
}

var chart = new ApexCharts(
    document.querySelector("#s-line-area"),
    sLineArea
);

chart.render();
}

// Simple Column
if (document.querySelector('#s-col')) {
var sCol = {
    chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        }
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'  
        },
    },
    // colors: ['#888ea8', '#3577f1'],
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    series: [{
        name: 'Net Profit',
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
        name: 'Revenue',
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }],
    xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    },
    yaxis: {
        title: {
            text: '$ (thousands)'
        }
    },
    fill: {
        opacity: 1

    },
    tooltip: {
        y: {
            formatter: function (val) {
                return "$ " + val + " thousands"
            }
        }
    }
}

var chart = new ApexCharts(
    document.querySelector("#s-col"),
    sCol
);

chart.render();
}

// Simple Column Stacked
if (document.querySelector('#s-col-stacked')) {
var sColStacked = {
    chart: {
        height: 350,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        }
    },
    // colors: ['#3577f1', '#888ea8', '#e3e4eb', '#d3d3d3'],
    responsive: [{
        breakpoint: 480,
        options: {
            legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
            }
        }
    }],
    plotOptions: {
        bar: {
            horizontal: false,
        },
    },
    series: [{
        name: 'PRODUCT A',
        data: [44, 55, 41, 67, 22, 43]
    },{
        name: 'PRODUCT B',
        data: [13, 23, 20, 8, 13, 27]
    },{
        name: 'PRODUCT C',
        data: [11, 17, 15, 15, 21, 14]
    },{
        name: 'PRODUCT D',
        data: [21, 7, 25, 13, 22, 8]
    }],
    xaxis: {
        type: 'datetime',
        categories: ['01/01/2011 GMT', '01/02/2011 GMT', '01/03/2011 GMT', '01/04/2011 GMT', '01/05/2011 GMT', '01/06/2011 GMT'],
    },
    legend: {
        position: 'right',
        offsetY: 40
    },
    fill: {
        opacity: 1
    },
}

var chart = new ApexCharts(
    document.querySelector("#s-col-stacked"),
    sColStacked
);

chart.render();
}

// Simple Bar
if (document.querySelector('#s-bar')) {
var sBar = {
    chart: {
        height: 350,
        type: 'bar',
        toolbar: {
          show: false,
        }
    },
    // colors: ['#3577f1'],
    plotOptions: {
        bar: {
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
    },
    series: [{
        data: [400, 430, 448, 470, 540, 580, 690, 1100, 1200, 1380]
    }],
    xaxis: {
        categories: ['South Korea', 'Canada', 'United Kingdom', 'Netherlands', 'Italy', 'France', 'Japan', 'United States', 'China', 'Germany'],
    }
}

var chart = new ApexCharts(
    document.querySelector("#s-bar"),
    sBar
);

chart.render();
}

// Mixed Chart
if (document.querySelector('#mixed-chart')) {
var options = {
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: false,
    }
  },
  // colors: ['#3577f1', '#888ea8'],
  series: [{
    name: 'Website Blog',
    type: 'column',
    data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
  }, {
    name: 'Social Media',
    type: 'line',
    data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
  }],
  stroke: {
    width: [0, 4]
  },
  title: {
    text: 'Traffic Sources'
  },
  labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
  xaxis: {
    type: 'datetime'
  },
  yaxis: [{
    title: {
      text: 'Website Blog',
    },

  }, {
    opposite: true,
    title: {
      text: 'Social Media'
    }
  }]

}

var chart = new ApexCharts(
  document.querySelector("#mixed-chart"),
  options
);

chart.render();
}

// Donut Chart

if (document.querySelector('#donut-chart')) {
var donutChart = {
    chart: {
        height: 350,
        type: 'donut',
        toolbar: {
          show: false,
        }
    },
    // colors: ['#3577f1', '#888ea8', '#e3e4eb', '#d3d3d3'],
    series: [44, 55, 41, 17],
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }]
}

var donut = new ApexCharts(
    document.querySelector("#donut-chart"),
    donutChart
);

donut.render();
}

// Radial Chart
if (document.querySelector('#radial-chart')) {
var radialChart = {
    chart: {
        height: 350,
        type: 'radialBar',
        toolbar: {
          show: false,
        }
    },
    // colors: ['#3577f1', '#888ea8', '#e3e4eb', '#d3d3d3'],
    plotOptions: {
        radialBar: {
            dataLabels: {
                name: {
                    fontSize: '22px',
                },
                value: {
                    fontSize: '16px',
                },
                total: {
                    show: true,
                    label: 'Total',
                    formatter: function (w) {
                        return 249
                    }
                }
            }
        }
    },
    series: [44, 55, 67, 83],
    labels: ['Apples', 'Oranges', 'Bananas', 'Berries'],    
}

var chart = new ApexCharts(
    document.querySelector("#radial-chart"),
    radialChart
);

chart.render();
}	
	
if (document.querySelector('#sales_charts')) {
	var options = {
		series: [{
		name: 'Sales',
		data: [130, 210, 300, 290, 150, 50, 210, 280, 105],
	  }, {
		name: 'Purchase',
		data: [-150, -90, -50, -180, -50, -70, -100, -90, -105]
	  }],
	  colors: ['#0ca678', '#e7515a'],
		chart: {
		type: 'bar',
		height: 320,
		stacked: true,
		
		zoom: {
		  enabled: true
		}
	  },
	  responsive: [{
		breakpoint: 280,
		options: {
		  legend: {
			position: 'bottom',
			offsetY: 0
		  }
		}
	  }],
	  plotOptions: {
		bar: {
		  horizontal: false,
          borderRadius: 4,
        borderRadiusApplication: "end", // "around" / "end" 
        borderRadiusWhenStacked: "all", // "all"/"last"
		  columnWidth: '20%',
		},
	  },
      dataLabels: {
      enabled: false
    },
      yaxis: {
          min: -200,
          max: 300,
          tickAmount: 5,
        },
	  xaxis: {
		categories: [' Jan ', 'Feb', 'Mar', 'Apr',
		  'May', 'Jun' , 'Jul' , 'Aug', 'Sep'
		],
	  },
	  legend: {show: false},
	  fill: {
		opacity: 1
	  }
	  };

	  var chart = new ApexCharts(document.querySelector("#sales_charts"), options);
	  chart.render();
	}

    if (document.querySelector('#sales-analysis')) {
    var options = {
      series: [{
        name: "Sales Analysis",
        data: [25, 30, 18, 15, 22, 20, 30, 20, 22, 18, 15, 20]
    }],
      chart: {
      height: 273,
      type: 'area',
      zoom: {
        enabled: false
      }
    },
    colors: ['#f39c12'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: '',
      align: 'left'
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    yaxis: {
      min: 10,
      max: 60,
      tickAmount: 5,
          labels: {
            formatter: (val) => {
              return val / 1 + 'K'
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left'
        }
    };

    var chart = new ApexCharts(document.querySelector("#sales-analysis"), options);
    chart.render();
  }

  // Student Chart

  if (document.querySelector('#student-chart')) {
    var donutChart = {
        chart: { height: 216, type: 'bar', stacked: true, stackType: '100%', toolbar: { show: false } },
        colors: ['#3D5EE1', '#e83e8c'],
        plotOptions: { bar: { horizontal: true, barHeight: '60%', borderRadius: 5, borderRadiusApplication: 'end' } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 3, colors: ['transparent'] },
        series: [
            { name: 'Male',   data: [540, 512, 498, 415] },
            { name: 'Female', data: [470, 452, 430, 337] }
        ],
        xaxis: { categories: ['Primary', 'Middle', 'High', 'Sr. Sec'], labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
        yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '12px' } } },
        grid: { show: false, padding: { left: 0, right: 0, top: -8, bottom: -8 } },
        legend: { show: true, position: 'top', horizontalAlign: 'left', fontSize: '12px', markers: { radius: 12 } },
        tooltip: { y: { formatter: function (v) { return v + ' students'; } } }
    }

    var donut = new ApexCharts(
      document.querySelector("#student-chart"),
      donutChart
  );

  donut.render();
  }

  // Student Chart

  if (document.querySelector('#teacher-chart')) {
    var donutChart = {
        chart: {
            height: 260,
            type: 'donut',
            toolbar: {
              show: false,
            }
        },
        colors: ['#3577f1', '#12b3b3'],
        series: [346, 54],
        labels: ['Present', 'Absent'],
        legend: {show: false},
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                  height: 180,
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }

    var donut = new ApexCharts(
      document.querySelector("#teacher-chart"),
      donutChart
  );

  donut.render();
  }


  // Student Chart

  if (document.querySelector('#staff-chart')) {
    var donutChart = {
        chart: {
            height: 260,
            type: 'donut',
            toolbar: {
              show: false,
            }
        },
        colors: ['#3577f1', '#12b3b3'],
        series: [620, 80],
        labels: ['Present', 'Absent'],
        legend: {show: false},
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                  height: 180,
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }

    var donut = new ApexCharts(
      document.querySelector("#staff-chart"),
      donutChart
  );

  donut.render();
  }


  // Class Chart

  if (document.querySelector('#class-chart')) {
    var donutChart = {
        chart: {
            height: 130,
            type: 'donut',
            toolbar: {
              show: false,
            },
            sparkline: {
              enabled: true
            }
        },
        colors: ['#3577f1', '#f39c12', '#e7515a'],
        series: [45, 11, 2],
        labels: ['Good', 'Average', 'Below Average'],
        legend: {show: false},
        dataLabels: {
              enabled: false
          },
        yaxis: {
          tickAmount: 3,
          labels: {
            offsetX: -15,
          },
        },
        grid: {
          padding: {
            left: -8,
          },
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }

    var donut = new ApexCharts(
      document.querySelector("#class-chart"),
      donutChart
  );

donut.render();
}

// Student Attendance Chart

if (document.querySelector('#attendance_chart')) {
    var donutChart = {
      chart: { height: 330, type: 'line', stacked: false, toolbar: { show: false } },
      colors: ['#3D5EE1', '#0ca678'],
      dataLabels: { enabled: false },
      stroke: { width: [0, 3], curve: 'smooth' },
      plotOptions: { bar: { columnWidth: '46%', borderRadius: 5, borderRadiusApplication: 'end' } },
      fill: { opacity: [1, 1] },
      series: [
        { name: 'Consumption (gal)', type: 'column', data: [2980, 3120, 3050, 3240, 3180, 3284] },
        { name: 'Efficiency (mpg)',  type: 'line',   data: [7.8, 8.1, 8.0, 8.3, 8.4, 8.6] }
      ],
      grid: { borderColor: 'rgba(148,163,184,.18)', strokeDashArray: 4, padding: { left: 4, right: 4 } },
      legend: { show: true, position: 'top', horizontalAlign: 'left', fontSize: '13px', markers: { radius: 12 }, itemMargin: { horizontal: 12 } },
      xaxis: {
        categories: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'],
        axisBorder: { show: false }, axisTicks: { show: false },
        labels: { style: { colors: '#94a3b8', fontSize: '12px' } }
      },
      yaxis: [
        { title: { text: 'Gallons', style: { color: '#94a3b8' } }, labels: { style: { colors: '#94a3b8', fontSize: '12px' } } },
        { opposite: true, min: 6, max: 10, title: { text: 'mpg', style: { color: '#0ca678' } }, labels: { style: { colors: '#94a3b8', fontSize: '12px' } } }
      ],
      tooltip: { theme: 'light', shared: true, intersect: false }
    }

    var donut = new ApexCharts(
      document.querySelector("#attendance_chart"),
      donutChart
    );

    donut.render();
  }

// Fees Chart

if (document.querySelector('#fees-chart')) {
  var sCol = {
      chart: { height: 320, type: 'polarArea', toolbar: { show: false }, animations: { speed: 600 } },
      series: [520, 610, 575, 660, 705, 690, 742, 720, 780, 815, 848, 902],
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      colors: ['#dbe4fb','#bcd0f8','#9dbcf4','#7ea8f0','#5f94ec','#4a82e6','#3D5EE1','#3654cc','#2f4ab7','#2840a2','#21368d','#1a2c78'],
      fill: { opacity: 0.92 },
      stroke: { width: 1, colors: ['#ffffff'] },
      dataLabels: { enabled: false },
      plotOptions: { polarArea: {
          rings: { strokeWidth: 1, strokeColor: 'rgba(148,163,184,.18)' },
          spokes: { strokeWidth: 1, connectorColors: 'rgba(148,163,184,.18)' }
      } },
      yaxis: { show: false },
      legend: { show: true, position: 'right', fontSize: '12px', markers: { radius: 12 }, itemMargin: { vertical: 2 } },
      tooltip: { theme: 'light', y: { formatter: function (v) { return v.toLocaleString() + ' books issued'; } } },
      responsive: [{ breakpoint: 991, options: { legend: { position: 'bottom' } } }]
  }

  var chart = new ApexCharts(
      document.querySelector("#fees-chart"),
      sCol
  );

  chart.render();
  }

  if (document.querySelector('#exam-result-chart')) {
    var options = {
      chart: {
        type: 'bar',
        height: 310
      },
      series: [{
        name: 'Marks',
        data: [100, 92, 90, 82, 90] // Corresponding scores for Maths, Physics, Chemistry, English, Spanish
      }],
      xaxis: {
        categories: ['Mat', 'Phy', 'Che', 'Eng', 'Sci']
      },
      plotOptions: {
        bar: {
          distributed: true,
          columnWidth: '50%',
          colors: {
            backgroundBarColors: ['#E9EDF4', '#fff'],
            backgroundBarOpacity: 1,
            backgroundBarRadius: 5,
          },
          dataLabels: {
            position: 'top'
          },
        }
      },
      colors: ['#E9EDF4', '#3577f1', '#E9EDF4', '#E9EDF4', '#E9EDF4'], // Set specific colors for each bar
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%"
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: '14px',
          colors: ["#304758"]
        }
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      
      legend: {
        show: false
      }
    }
  
    var chart = new ApexCharts(document.querySelector("#exam-result-chart"), options);
    chart.render();
  }

  // Student Attendance Heatmap

  if (document.querySelector('#attendance_heatmap')) {
    var heatDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Cells are drawn edge to edge, so the gap between them is the cell's own
    // stroke. A transparent stroke shows the neighbouring cell through it and
    // reads as no gap at all — it has to be painted in the surface colour.
    // Reading that from the card keeps it correct in either theme.
    var heatHost = document.querySelector('#attendance_heatmap');
    var heatCard = heatHost.closest('.card') || heatHost;
    var heatSurface = window.getComputedStyle(heatCard).backgroundColor || '#FFF';

    // one series per grade; each point is a weekday reading
    function heatRow(grade, values) {
      return {
        name: grade,
        data: values.map(function (v, i) { return { x: heatDays[i], y: v }; })
      };
    }

    var heatmapConfig = {
      chart: {
        // the mount is a flex child, so the chart grows with the card rather
        // than leaving dead space above the footer
        type: 'heatmap', height: '380', toolbar: { show: false },
        fontFamily: 'inherit', parentHeightOffset: 0
      },
      // Apex draws series bottom-up, so the grades are listed in reverse
      series: [
        heatRow('Grade XII', [96, 91, 96, 88, 96, 91]),
        heatRow('Grade XI',  [88, 91, 88, 96, 91, 96]),
        heatRow('Grade X',   [91, 96, 96, 88, 91, 82]),
        heatRow('Grade IX',  [96, 88, 91, 96, 96, 88]),
        heatRow('Grade VIII',[88, 91, 96, 96, 88, 91]),
        heatRow('Grade VII', [91, 96, 88, 96, 91, 82]),
        heatRow('Grade VI',  [96, 91, 96, 88, 91, 96])
      ],
      dataLabels: { enabled: false },
      stroke: { show: true, width: 6, colors: [heatSurface] },
      plotOptions: {
        heatmap: {
          radius: 6,
          enableShades: false,
          useFillColorAsStroke: false,
          colorScale: {
            ranges: [
              { from: 0,  to: 84,  color: '#E2E7FA', name: 'Below 85%' },
              { from: 85, to: 89,  color: '#B1BEF3', name: '85 - 89%' },
              { from: 90, to: 94,  color: '#8196EC', name: '90 - 94%' },
              { from: 95, to: 100, color: '#3D5EE1', name: '95% and above' }
            ]
          }
        }
      },
      xaxis: {
        type: 'category',
        position: 'top',
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
        labels: { style: { colors: '#6A7287', fontSize: '12px', fontWeight: 600 } }
      },
      // the grade names are the widest labels here, so the axis is given a
      // fixed gutter rather than letting Apex guess and clip them
      yaxis: {
        labels: { minWidth: 74, align: 'left', style: { colors: '#6A7287', fontSize: '12px' } }
      },
      grid: { padding: { left: 8, right: 8, top: 0, bottom: 0 } },
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '12px',
        offsetY: 4,
        labels: { colors: '#6A7287' },
        markers: { radius: 3 },
        itemMargin: { horizontal: 10, vertical: 4 }
      },
      tooltip: {
        theme: 'light',
        y: { formatter: function (val) { return val + '% attendance'; } }
      }
    };

    new ApexCharts(heatHost, heatmapConfig).render();
  }

  if (document.querySelector('#performance_chart')) {
    var options = {
      chart: {
        type: 'area',
        height: 355
      },
      series: [{
        name: 'SMS',
        data: [648, 712, 596, 703, 781, 432, 355]
      }, {
        name: 'Email',
        data: [425, 478, 398, 452, 517, 268, 157]
      }, {
        name: 'App',
        data: [312, 358, 294, 341, 388, 201, 126]
      }],
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toLocaleString() + " sent";
          }
        },
        shared: true,
        intersect: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      grid: {
        padding: {
          left: -15,
          right: 0,
        },
      },
      grid: {   
        yaxis: {
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: '#78909C',
            width: 6,
            offsetX: 0,
            offsetY: 0
        },
          
        },
      },
        yaxis: {
          labels: {
            offsetX: -15
          },
        },
      markers: {
        size: 5,
        colors: ['#3D5EE1', '#0F65CD', '#1ABE17'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      colors: ['#3D5EE1', '#0F65CD', '#1ABE17'], // SMS, Email, App
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        }
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center'
      }
    }
    var chart = new ApexCharts(document.querySelector("#performance_chart"), options);
    chart.render();
  }

  // Plan Chart

if (document.querySelector('#plan_chart')) {
  var donutChart = {
      chart: {
          height: 90,
          type: 'donut',
          toolbar: {
            show: false,
          }, 
          sparkline: {
            enabled: true
          }
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0
        }
       },
     plotOptions: {
          bar: {
              horizontal: false,
              columnWidth: '50%'
          },
      },
    dataLabels: {
          enabled: false
      },
    
      series: [95,5],
    labels: [
          'Completed',
          'Pending'

      ],
      legend: {show: false},
      colors:['#3577f1','#e7515a'],
      responsive: [{
          breakpoint: 480,
          options: {
              chart: {
                  width: 100
              },
              legend: {
                  position: 'bottom'
              }
          }
      }],
    legend: {
          position: 'bottom'
      }
  }
  
  var donut = new ApexCharts(
      document.querySelector("#plan_chart"),
      donutChart
  );
  
  donut.render();
  }
 
  if (document.querySelector('#statistic_chart')) {
    var options = {
      chart: {
        type: 'line',
        height: 345,
      },
      series: [{
        name: 'Avg. Exam Score',
        data: [0, 32, 40, 50, 60, 52, 50,44,40,60,75,70] // Sample data
      }, {
        name: 'Avg. Attendance',
        data: [0,35,43,34,30,28,25,50,60,75,77,80] // Sample data
      }],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + "%";
          }
        },
        shared: true,
        intersect: false,
        custom: function({series, seriesIndex, dataPointIndex, w}) {
          return `<div class="apexcharts-tooltip">${w.globals.labels[dataPointIndex]}<br>Exam Score: <span style="color: #1E90FF;">${series[0][dataPointIndex]}%</span><br>Attendance: <span style="color: #00BFFF;">${series[1][dataPointIndex]}%</span></div>`;
        }
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        yaxis: {
          lines: {
            show: true
          }
        },
      }, 
      yaxis: {
        labels: {
          offsetX: -15
        },
      },
      grid: {
        padding: {
          left: -8,
        },
      },
      markers: {
        size: 0,
        colors: ['#1E90FF', '#00BFFF'],
        strokeColors: '#fff',
        strokeWidth: 1,
        hover: {
          size: 7
        }
      },
      colors: ['#3577f1', '#12b3b3'], // Color for the lines
      legend: {
        position: 'top',
        horizontalAlign: 'left'
      }
    }
    var chart = new ApexCharts(document.querySelector("#statistic_chart"), options);
    chart.render();
  }

  if (document.querySelector('#attendance_chart2')) {
    var donutChart = {
        chart: {
            height: 290,
            type: 'donut',
            toolbar: {
              show: false,
            }
        },
       plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%'
            },
        },
      dataLabels: {
            enabled: false
        },
      
        series: [60,5,15,20],
      labels: [
            'Present',
            'Late',
            'Half Day',
            'Absent'
        ],
        colors:['#0ca678','#3577f1','#E9EDF4','#e7515a'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'left'
                }
            }
        }],
      legend: {
            position: 'left',
      }
    }
    
    var donut = new ApexCharts(
        document.querySelector("#attendance_chart2"),
        donutChart
    );
    
    donut.render();
  }

// Total Earning
 if (document.querySelector('#total-earning')) {
  var sLineArea = {
      chart: { height: 300, type: 'line', toolbar: { show: false } },
      colors: ['#3D5EE1', '#94a3b8', '#0ca678'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: [3, 2, 2], dashArray: [0, 5, 6] },
      grid: { borderColor: 'rgba(148,163,184,.18)', strokeDashArray: 4, padding: { left: 4, right: 4 } },
      legend: { show: true, position: 'top', horizontalAlign: 'left', fontSize: '13px', markers: { radius: 12 }, itemMargin: { horizontal: 12 } },
      markers: { size: 0, hover: { size: 5 } },
      xaxis: {
          categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
          axisBorder: { show: false }, axisTicks: { show: false },
          labels: { style: { colors: '#94a3b8', fontSize: '12px' } }
      },
      yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '12px' } } },
      annotations: { yaxis: [{ y: 420, borderColor: '#e83e8c', strokeDashArray: 4,
          label: { text: 'Admission Target 420', style: { color: '#fff', background: '#e83e8c', fontSize: '11px' }, position: 'left', textAnchor: 'start' } }] },
      tooltip: { theme: 'light', shared: true, y: { formatter: function (v) { return v == null ? '' : v + ' students'; } } },
      series: [
          { name: 'This Year', data: [210, 265, 240, 300, 285, 330, 360, 345, 390, null, null, null] },
          { name: 'Last Year', data: [180, 205, 220, 250, 240, 275, 300, 295, 320, 335, 350, 365] },
          { name: 'Forecast',  data: [null, null, null, null, null, null, null, null, 390, 405, 418, 436] }
      ]
  }

  var chart = new ApexCharts(
      document.querySelector("#total-earning"),
      sLineArea
  );

  chart.render();
  }

  // Total Expenses
 if (document.querySelector('#total-expenses')) {
  var sLineArea = {
      chart: {
          height: 90,
          type: 'area',
          toolbar: {
            show: false,
          },
          sparkline: {
            enabled: true
          }
      },
      colors: ['#e7515a'],
      dataLabels: {
          enabled: false
      },
      stroke: {
          curve: 'straight'
      },
      series: [{
          name: 'Earnings',
          data: [40, 20, 60, 55, 50, 55, 40]
      }]
  }
  
  var chart = new ApexCharts(
      document.querySelector("#total-expenses"),
      sLineArea
  );
  
  chart.render();
  }
  

  // Performance Risk Matrix (scatter quadrant)
  if (document.querySelector('#risk-matrix')) {
    var riskOpt = {
      chart: { height: 236, type: 'scatter', toolbar: { show: false }, zoom: { enabled: false }, animations: { speed: 500 } },
      colors: ['#16a34a', '#d97706', '#dc2626'],
      series: [
        { name: 'Low Risk',    data: [[96,92],[93,88],[90,85],[88,90],[85,82],[92,79],[98,95],[83,86],[95,84]] },
        { name: 'Medium Risk', data: [[78,66],[74,71],[80,62],[70,68],[76,58],[72,74],[68,64]] },
        { name: 'High Risk',   data: [[58,48],[52,42],[61,55],[47,50],[55,38],[44,46]] }
      ],
      markers: { size: 6, strokeWidth: 0, fillOpacity: 0.8, hover: { size: 8 } },
      xaxis: { title: { text: 'Attendance %', style: { color: '#94a3b8', fontSize: '11px' } }, min: 40, max: 100, tickAmount: 6, axisBorder: { show: false }, axisTicks: { show: false }, labels: { style: { colors: '#94a3b8', fontSize: '11px' } } },
      yaxis: { title: { text: 'Avg Score', style: { color: '#94a3b8', fontSize: '11px' } }, min: 30, max: 100, tickAmount: 5, labels: { style: { colors: '#94a3b8', fontSize: '11px' } } },
      grid: { borderColor: 'rgba(148,163,184,.18)', strokeDashArray: 4, padding: { left: 6, right: 6 } },
      annotations: {
        xaxis: [{ x: 72, borderColor: 'rgba(148,163,184,.5)', strokeDashArray: 5 }],
        yaxis: [{ y: 65, borderColor: 'rgba(148,163,184,.5)', strokeDashArray: 5 }],
        points: [{ x: 96, y: 95, marker: { size: 0 }, label: { text: 'Star Zone', borderColor: '#16a34a', style: { background: '#16a34a', color: '#fff', fontSize: '9px' } } }]
      },
      legend: { show: false },
      tooltip: { theme: 'light', custom: function(o){ var s=['Low Risk','Medium Risk','High Risk'][o.seriesIndex]; var d=o.w.config.series[o.seriesIndex].data[o.dataPointIndex]; return '<div style="padding:6px 10px;font-size:12px"><b>'+s+'</b><br>Attendance '+d[0]+'% � Score '+d[1]+'</div>'; } }
    }
    var riskChart = new ApexCharts(document.querySelector("#risk-matrix"), riskOpt);
    riskChart.render();
  }

  
  // Delivery Chart
  if (document.querySelector('#delivery_chart')) {
    var deliveryChart = {
      chart: {
        height: 30,
        width: '100%',
        type: 'bar',
        toolbar: { show: false },
        sparkline: { enabled: true },
        offsetX: 0
      },
      colors: ['#3d5ee1'],
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '90%',
          borderRadius: 2
        }
      },
      series: [{
        name: 'Delivery',
        data: [
          [1, 52], [2, 64], [3, 58], [4, 72], 
          [5, 66], [6, 80], [7, 74], [8, 88], 
          [9, 82], [10, 94], [11, 90], [12, 100]
        ]
      }],
      xaxis: {
        type: 'numeric',
        min: 0.5,
        max: 12.5,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      grid: {
        padding: { left: 0, right: 0, top: 0, bottom: 0 }
      },
      tooltip: {
        fixed: { enabled: false },
        x: { show: false },
        y: { title: { formatter: function (seriesName) { return '' } } },
        marker: { show: false }
      }
    };
    var chart = new ApexCharts(document.querySelector("#delivery_chart"), deliveryChart);
    chart.render();
  }

  function createMiniBarChart(id, color, data) {
    if (document.querySelector(id)) {
      var options = {
        chart: {
          height: 30,
          width: 60,
          type: 'bar',
          toolbar: { show: false },
          sparkline: { enabled: true },
          offsetX: 0
        },
        colors: [color],
        dataLabels: { enabled: false },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '80%',
            borderRadius: 2
          }
        },
        series: [{ name: 'Delivery', data: data }],
        grid: {
          padding: { left: -5, right: -5, top: 0, bottom: 0 }
        },
        tooltip: {
          fixed: { enabled: false },
          xaxis: { type: 'numeric', min: 1, max: 7, labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
          y: { title: { formatter: function (seriesName) { return '' } } },
          marker: { show: false }
        }
      };
      var chart = new ApexCharts(document.querySelector(id), options);
      chart.render();
    }
  }

  createMiniBarChart("#sms_chart", "#16a34a", [60, 72, 55, 84, 78, 92, 100]);
  createMiniBarChart("#email_chart", "#3d5ee1", [50, 66, 58, 70, 62, 80, 88]);
  createMiniBarChart("#app_push_chart", "#f39c12", [70, 64, 82, 76, 90, 86, 96]);
  createMiniBarChart("#whatsapp_chart", "#16a34a", [78, 84, 72, 90, 88, 95, 99]);

  // Utilization Chart
  if (document.querySelector('#utilization_chart')) {
    var utilChart = {
      chart: {
        height: 40,
        width: '100%',
        type: 'bar',
        toolbar: { show: false },
        sparkline: { enabled: true }
      },
      colors: ['#3d5ee1'],
      dataLabels: { enabled: false },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '90%',
          borderRadius: 2
        }
      },
      series: [{
        name: 'Utilization',
        data: [
          [1, 58], [2, 66], [3, 60], [4, 74], 
          [5, 70], [6, 82], [7, 78], [8, 88], 
          [9, 84], [10, 94], [11, 90], [12, 100]
        ]
      }],
      xaxis: {
        type: 'numeric',
        min: 0.5,
        max: 12.5,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      grid: {
        padding: { left: 0, right: 0, top: 0, bottom: 0 }
      },
      tooltip: {
        fixed: { enabled: false },
        x: { show: false },
        y: { title: { formatter: function (seriesName) { return '' } } },
        marker: { show: false }
      }
    };
    var chart = new ApexCharts(document.querySelector("#utilization_chart"), utilChart);
    chart.render();
  }

});
