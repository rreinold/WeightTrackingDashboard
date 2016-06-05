function visualize(){

  removeChildren(document.getElementById("graph0"))
  removeChildren(document.getElementById("graph1"))

  var graph = document.getElementById("graph0")
  var bar = new ProgressBar.Line(graph, {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#39CCCC',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: {width: '100%', height: '100%'},
    text: {
      style: {
        // Text color.
        // Default: same as stroke color (options.color)
        color: '#999',
        position: 'absolute',
        right: '0',
        top: '30px',
        padding: 0,
        margin: 0,
        transform: null
      },
      autoStyleContainer: false
    },
    from: {color: '#FFEA82'},
    to: {color: '#ED6A5A'},
    step: (state, bar) => {
      bar.setText((progress * 100) + "% ( " +Math.round(progress * 77) + " / 77 lbs )");
    }
  });

  bar.animate(progress);  // Number from 0.0 to 1.0

  var graph = document.getElementById("graph1")
  var bar = new ProgressBar.Line(graph, {
    strokeWidth: 4,
    easing: 'easeInOut',
    duration: 1400,
    color: '#FF851B',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: {width: '100%', height: '100%'},
    text: {
      style: {
        // Text color.
        // Default: same as stroke color (options.color)
        color: '#999',
        position: 'absolute',
        right: '0',
        top: '30px',
        padding: 0,
        margin: 0,
        transform: null
      },
      autoStyleContainer: false
    },
    from: {color: '#FFEA82'},
    to: {color: '#ED6A5A'},
    step: (state, bar) => {
      bar.setText(Math.round(elapsed * 100) + "% ( "+Math.round(elapsed * 12) + " / 12 weeks )");
    }
  });

  bar.animate(elapsed);  // Number from 0.0 to 1.0
}