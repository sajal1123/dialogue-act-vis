class ToolTip {
    static moveTTip(tTip, tipX, tipY){
      var tipBBox = tTip.node().getBoundingClientRect();
      while(tipBBox.width + tipX > window.innerWidth){
          tipX = tipX - 10 ;
      }
      while(tipBBox.height + tipY > window.innerHeight){
          tipY = tipY - 10 ;
      }
      tTip.style('left', tipX + 'px')
          .style('top', tipY + 'px')
          .style('visibility', 'visible')
          .style('z-index', 1000);
    }
  
    static moveTTipEvent(tTip, event){
        var tipX = event.pageX + 30;
        var tipY = event.pageY -20;
        this.moveTTip(tTip,tipX,tipY);
    }
  
  
    static hideTTip(tTip){
        tTip.style('visibility', 'hidden')
    }
  
    static addTTipCanvas(tTip, className, width, height){
        tTip.selectAll('svg').selectAll('.'+className).remove();
        let canvas = tTip.append('svg').attr('class',className)
            .attr('height',height).attr('width',width)
            .style('background','white');
        return canvas
    }
  }

export default ToolTip;