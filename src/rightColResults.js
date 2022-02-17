import './App.css';







function retRightCol(data, currPrice, avg_dec, currProf, pData, roundPrice){
	function retCurrPrice(){
	    var profColor = "green";
	    var profSign = "+";
	    var firstPrice = pData.yrPrice[pData.yrPrice.length-1].price;
	    var percentChange = Math.round(10000*(currPrice.value-firstPrice)/(firstPrice))/100;
	    if ((currPrice.value-firstPrice)<0){
	      profColor = "red";
	      profSign = "-";
	      return(<span>{"$"+currPrice.value.toLocaleString('en-US')+"\u00A0\u00A0(" }<span style={{color: profColor}}>
	         &#9660;{profSign+'$'+String(Math.abs(roundPrice(currPrice.value-firstPrice))).toLocaleString('en-US')+ ",\u00A0"+
	         percentChange.toLocaleString('en-US')+"%"}</span>{")"}</span>)
	    }else{
	      return(<span>{"$"+currPrice.value.toLocaleString('en-US')+"\u00A0\u00A0(" }<span style={{color: profColor}}>
	         &#9650;{profSign+'$'+String(Math.abs(roundPrice(currPrice.value-firstPrice))).toLocaleString('en-US')+ ",\u00A0"+
	         percentChange.toLocaleString('en-US')+"%"}</span>{")"}</span>)
	    }
	  }


  function retMarketVal(){
    var profColor = "green";
    var profSign = "+";
    var boolS;
    function returnSign(signBool){
    	if (signBool==false){
    	 return(<span> &#9660;</span>);
    	}else{
    		return(<span> &#9650;</span>);
    	}
    };
    var percentChange = Math.round(10000*currProf.value/(currProf.totValue-currProf.value))/100;
    if (currProf.value<0){
      profColor = "red";
      profSign = "-";
    	boolS = false;
    }else{
    	profColor = "green";
      profSign = "+";
    	boolS = true;   
    } 
    if(currProf.totValue>=100000){
    	return(<span>{"$"+currProf.totValue.toLocaleString('en-US')}<br></br>{"(" }<span style={{color: profColor}}>
        {returnSign(boolS)}{profSign+'$'+(Math.abs(currProf.value)).toLocaleString('en-US')+ 
        ",\u00A0"+percentChange.toLocaleString('en-US')+"%"}</span>{")"}</span>)
    } 
    else{
    	return(<span>{"$"+currProf.totValue.toLocaleString('en-US')+"\u00A0\u00A0(" }<span style={{color: profColor}}>
        {returnSign(boolS)}{profSign+'$'+(Math.abs(currProf.value)).toLocaleString('en-US')+ 
        ",\u00A0"+percentChange.toLocaleString('en-US')+"%"}</span>{")"}</span>)
    }
   
  }

  function roundDec(amount){
  	var mult = 1;
  	if (amount>=1){
  		mult = 100;
  	}else if (amount>=0.1){
  		mult = 1000; 
  	}else if (amount>=0.01){
  		mult = 10000; 
  	}else if (amount>=0.001){
  		mult = 100000; 
  	}else{
  		mult = 1000000;
  	}
  	return Math.round(mult*amount)/mult;
  }

  function roundShares(amount){
  	var mult = 1;
  	if (amount>=1000){
  		mult=100
  		return (Math.round(mult*amount)/mult).toLocaleString('en-US');
  	}
  	else if(amount>=10){
  		mult = 100;
  	}else if (amount>=1){
  		mult = 1000;
  	}else if (amount>=0.1){
  		mult = 10000; 
  	}else if (amount>=0.01){
  		mult = 100000; 
  	}else if (amount>=0.001){
  		mult = 1000000; 
  	}else{
  		mult = 10000000;
  	}
  	return Math.round(mult*amount)/mult;
  }

  function retMinPInfo(){
  	console.log()
  	if(currProf.minSpend<1){
  		return(
  		<span >
  			<p>{"With this input, a minimum of "} <span style={{color: "darkgrey"}}>$1</span> {
  				" will be spent when the 52 wk. high decline is "
  		}<span style={{color: "darkgrey"}}>{roundDec(currProf.minDSpend)+"%. "}</span>{
  			"For declines lower than this no purchases are made."
  			}</p>
  		</span>
  		);
  	}else{
  		return(
  		<span >
  			<p >{"With this input, a minimum of " }<span style={{color: "darkgrey"}}>{"$"+currProf.minSpend}</span>{
  				" will be spent when the 52 wk. high decline is "
  		}<span style={{color: "darkgrey"}}>{roundDec(currProf.minDSpend)+"% "}</span>{"or lower."}</p>
  		</span>
  		)
  	}
  }

  function retEvenCalc(){
  	 if ((currProf.sharesBought-currProf.evStock)<0){
      var profColor = "red";
      var profSign = "";
  	}else{
  		var profColor = "green"
  		var profSign = "+";
  	}
  	return(
  		<span>
  			<p>{"If your principal of "}<span style={{color: "darkgrey"}}>{"$"+roundPrice(currProf.principal).toLocaleString('en-US')}</span>{
  			" was invested in constant recurring purchases of "}<span style={{color: "darkgrey"}}>{"$"+roundPrice(currProf.evSpend).toLocaleString('en-US')}</span>{
  			" you would own "}<span style={{color: "darkgrey"}}>{ roundShares(currProf.evStock)}</span>{" shares."}</p>
  			<p>{"Using this recurring investment algorithm your position market value would differ by "} 
  			<span style={{color: profColor}}>{profSign+Math.round(10000*(currProf.sharesBought-currProf.evStock)/currProf.evStock)/100+"%"}</span>
  			{" compared to a constant recurring investment." }</p>
  		</span>
  		) 
  }



  	return(
  	<div style={{marginTop: '2vw'}} >
  		<h1 style={{color: "lightblue", fontSize:"3vw"}}>Computed results</h1>
		  <div className="resultBmargin"><label className="resultBlabel"><span style={{color: "darkgrey"}}>Selected Ticker:</span> {"\u00A0"} {data.loading ? "Input required..." : data.ticker}</label></div>
		  <div className="resultMmargin"><label className="resultBlabel" style ={{ color:"darkgrey"}}>Current Price:</label></div>
		  <div className="resultBmargin"><label className="resultBlabel">{currProf.loading ? "" : retCurrPrice()}</label></div>
		  <div className="resultBmargin"><label className="resultBlabel"><span style={{color: "darkgrey"}}>Average 52wk High Decline:</span>{"\u00A0"} {avg_dec.loading ? "" : avg_dec.value+"%"}</label></div>
		  <div className="resultMmargin"><label className="resultBlabel" style ={{ color:"darkgrey"}}>Today's purchase:</label></div>
		  <div className="resultMmargin"><label className="resultBlabel">{currProf.loading? "": "$"+currProf.todaySpend}</label></div>
		  <div className="resultMmargin"><label className="resultBlabel" style ={{ color:"darkgrey"}}>Min. purchase info:</label></div>		  
		  <div className="resultBmargin" style={{marginRight: '2vw'}}><label className="resultMlabel">{currProf.loading? "": retMinPInfo()}</label></div> 
		  <div className="resultBmargin"><label className="resultBlabel" style={{color: "lightblue"}}>Your Position</label></div>
		  <div className="resultMmargin"><label className="resultBlabel" style ={{ color:"darkgrey"}}>Current Market Value:</label></div>
		  <div className="resultBmargin"><label className="resultMlabel">{currProf.loading? "": retMarketVal()}</label></div> 
		  <div className="resultBmargin"><label className="resultBlabel"><span style={{color: "darkgrey"}}>Shares purchased:</span>{"\u00A0\u00A0"}{currProf.loading? "":  roundShares(currProf.sharesBought)}</label></div>
	 	  <div className="resultBmargin"><label className="resultMlabel">{currProf.loading? "": retEvenCalc()}</label></div>
	 	 </div>
	 );
}

export{retRightCol};