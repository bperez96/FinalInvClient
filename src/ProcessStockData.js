function getStockInvestment(dataPlot, maxData, inMinS, inMaxS, inHP, startDate, currPrice){
	var inHp = parseFloat(inHP)/100;
	inMinS = parseFloat(inMinS);
	inMaxS = parseFloat(inMaxS);
	var todaySpend = 0;
	var maxTracker = {price: -Infinity, date: 0};
	function getPrevYrMax(currData){
		if (currData.date - maxTracker.date<=365*24*3600 && currData.price< maxTracker.price){
			return maxTracker.price;
		}
		else if (currData.date - maxTracker.date<=365*24*3600&& currData.price>= maxTracker.price){
			maxTracker = currData;
			return currData.price;
		}
		else{
			var prevYearData  = maxData.filter(item => (item.date<=currData.date &&
			 	item.date>=currData.date-365*24*3600));
			if (prevYearData.length == 0){
				maxTracker = currData;
				return currData.price;				
			} else{
				var tempMax = {price: 0, date: 0}; 
				for (var i=0; i<prevYearData.length; i++){
					if (prevYearData[i].price>=tempMax.price){
						tempMax = prevYearData[i];
					}
				}
				maxTracker = tempMax;
				return tempMax.price
			}
		}
	}
	
	//var iterData = maxData.filter(item=>item.date>=startDate/1000)
	var maxDicList = [];

	for (var i=0; i<dataPlot.length; i++){	
		var j =  dataPlot.length-1-i;		
		var currMax = getPrevYrMax(dataPlot[j]);
	 	maxDicList[j]={date:dataPlot[j].date, max: currMax};
	}
	
	function computeDec(cP, mP){
		var cdec = (cP-mP)/mP;
		if( cdec<=0){
			cdec = Math.abs(cdec)
		}else{
			cdec = 0;
		}
		return cdec;
	}
	function computePercentS(currD){

		var denom_a = inHp/(1-inHp);
		var denom = denom_a*(1-currD)+currD;
		var theP = currD/denom;
		return theP;
	}

	function getTodaySpend(){
		var currDec = computeDec(currPrice, maxDicList[0].max);
		if (inHp == 0){
				var currPer=1;
		}else{
			var currPer = computePercentS(currDec);
		}
		var currSpend = currPer*inMaxS;
		if (currSpend<1){
			currSpend = 0
		}
		if (currSpend<inMinS){
			currSpend = inMinS;
		}
		return currSpend
	}

	function getMinDSpend(){
		var tempMin = inMinS;
		if (inHp ==0){
			return(0)
		}else if (inMinS<1)
		{
			tempMin = 1;
		}
		var hF = inHp/(1-inHp);
		var sF = tempMin/inMaxS;
		var result = sF*hF/(1+sF*hF-sF);
		return result;
	}



	//var tot_spend = 0;
	var stocksP = 0;
	var currSpent = 0;
	var spendList = [];
	var avg_dec = 0;
	var stocksPEven = 0;
	var evenSpend = 0;
	function spendNow(){
		var currP = 0;
		
		
		var currSpend = 0;
		for(var i =dataPlot.length-1;i>=0;i--){
			var currDec = computeDec(dataPlot[i].price, maxDicList[i].max);
			avg_dec+=currDec;
			if (inHp == 0){
				currP=1;
			}else{
				currP = computePercentS(currDec);
			}
			currSpend = currP*inMaxS;
			if (currSpend<1){
				currSpend = 0
			}
			if (currSpend<inMinS){
				currSpend = inMinS;
			}
			currSpent+=currSpend;
			stocksP+=currSpend/dataPlot[i].price;
			var currProf = stocksP*dataPlot[i].price-currSpent;
			spendList.push({date: dataPlot[i].date, profit: currProf, daySpend: currSpend, price: dataPlot[i].price})
		}
		
		evenSpend = currSpent/dataPlot.length;
		for (var j =dataPlot.length-1;j>=0;j--){
			stocksPEven+=evenSpend/dataPlot[j].price;
		}

		avg_dec = 100*(avg_dec/dataPlot.length);
	}
	spendNow()
	todaySpend = getTodaySpend()
	var minDSpend = getMinDSpend();
	return({profitList: spendList, totSpent: currSpent, avgD: avg_dec, totStocks: stocksP, 
		evenStock: stocksPEven, evenPay: evenSpend, todayS: todaySpend,  minDSpend: minDSpend, maxS: inMaxS});

}

function returnSpyPlotData(fullDataSpy)
	{
			var formattedSpyData = fullDataSpy.message.map((item) =>{
	      var container = {};
        container.date = item[0];
	      container.price = item[1];
	      return container
	   });
			return formattedSpyData;


};

function retComputationSet(fullDataRes){
	var spendData = fullDataRes.message.map((item) =>{
	          var container = {};
	          container.date = item[0];
	          container.price = item[1];
	          return container
	        });
    var historicalData = fullDataRes.yplus.map((item) =>{
      var container = {};
      container.date = item[0];
      container.price = item[1];
      return container
    });
    return [spendData, historicalData];

}


export{getStockInvestment, retComputationSet, returnSpyPlotData};