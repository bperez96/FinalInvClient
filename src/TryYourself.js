import React from "react";
import ReactLoading from 'react-loading';
import { getStockInvestment , retComputationSet} from './ProcessStockData.js';
import { validDate, checkHP, checkSpend } from './validateInput.js';
import { returnPriceGraph, returnSpendGraph, returnComparissonGraph,
returnHPGraph} from './plottingFormatting.js';
import {retRightCol} from './rightColResults.js';
import './App.css';


function TryYourself(){
	var pMax = 0;
  	var pMin = 0;
  	var theProf;
  	var stockYrUrl;
    var todayDate = new Date();
    var yesterDate = (todayDate.getMonth()+1)+"/"+todayDate.getDate()+"/"+(todayDate.getFullYear()-1);
	const [stock, setStock] = React.useState("SPY");
	const [inDate, setIDate] = React.useState(yesterDate);
	const [inMinS, setInMinS] = React.useState(0);
	const [inMaxS, setInMaxS] = React.useState(10);
	const [inFreq, setInFreq] = React.useState("daily");
	const [inHP, setInHP] = React.useState(1);

	const [sDate, setSDate] = React.useState({
    theDate: yesterDate,
    loading: false,
    microDate: NaN
  	});
	const [avg_dec, setAvgD] = React.useState({
	  value: "",
	  loading: true
	});

	const [currProf, setProfit] = React.useState({
	value: "",
	loading: true
	});

	const [currPrice, setCP] = React.useState({
	value: "",
	loading: true
	});

	const [hpS, setHPS] = React.useState({
	value: 1,
	loading: false
	});
	const [maxS, setMaxS] = React.useState({
	value: 10,
	loading: false
	});
	const [minS, setMinS] = React.useState({
	value: 0,
	loading: true
	})
	const [data, setData] = React.useState({
	ticker: "SPY",
	loading: false
	});
	const [pData, setPData] = React.useState({
		yrPrice: ['test'],
		loading: true
	});

	const [spendData, setSData] = React.useState({
		yrSpend: ['test'],
		loading: true
	});

	const [wGHP, setWGHP] = React.useState({value: 10});
 	const [dGHP, setDGHP] = React.useState({value: 0});
 	const [graphHP, setGHP] =  React.useState({value: 10});
  	const [loadOn, setLoadOn] = React.useState(false);

	React.useEffect(()=>{
		let isCancelled = false;
 		getGraphData().then(()=>{
 			if (!isCancelled){
 					var yes = "yes"
 			}
 		});  	 
  	return () => {
      isCancelled = true;
    };
	},[]);

	const inputHP = (tval)=>{
		setInHP(tval);
	}

	const inputIDate = (tval)=>{
		setIDate(tval);
	}

	const inputStock = (tval)=>{
		setStock(tval)
		stockYrUrl =  "/apiGraph?stock="+tval;
	}
	const inputIFreq = (tval)=>{
		setInFreq(tval)
	}
	const inputMinS = (tval)=>{
		setInMinS(tval)
	}
	const inputMaxS = (tval)=>{
		setInMaxS(tval)
	}





	function roundPrice(val){
		var tempVar = Math.round(val*100)/100;
		return tempVar;
	}

	async function getGraphData(){ 
		setLoadOn(true)
		await setData({ticker: '', loading: false});
		await setCP({value: "", loading: true});
		await setProfit({value: "", loading: true});
		await setAvgD({value: "",loading: true})
		var aDate = new Date(inDate);
		var mDate =  (aDate.valueOf());
		await setSDate({theDate: aDate, loading: false});    
		var spendOk = false;
		var hpOk=false;

		var hpObjSet;
		var hpHolder = checkHP(inHP)
		hpOk = hpHolder[0];
		hpObjSet = hpHolder[1];
		await setHPS(hpObjSet)


		var spendHolder = checkSpend(inMinS, inMaxS);
		var [spendOk , maxObjSet, minObjSet] = [...spendHolder];
		await setMaxS(maxObjSet);
		await setMinS(minObjSet);

		//if the input start date, spend amounts, and hp parameter are valid
		//execute a api call with the input stock name 
		if (validDate(mDate) && spendOk && hpOk && typeof(stock)=='string'){
		  stockYrUrl = await "https://recurr-inv-backend-deploy.herokuapp.com/apiGraph?stock="+stock.trim().toUpperCase()+
		    "&month="+aDate.getMonth()+"&day="+aDate.getDate()+
		    "&year="+aDate.getFullYear()+"&freq="+inFreq;
		  var fullDataRes = await fetch(stockYrUrl).then((res)=>res.json());
		  if ( fullDataRes.message == "Invalid stock search"){
		      await setPData({yrPrice: ['test'], loading: false});
		      await setData({ticker: 'Invalid stock input.', loading: false});
		      setLoadOn(false)
		     
		  }
		  else{
		    var compSetHolder = retComputationSet(fullDataRes);
		    var startDateData = compSetHolder[0];
		    var startDateDataYrP = compSetHolder[1];

		    var investData = getStockInvestment(startDateData, startDateDataYrP, inMinS, inMaxS, inHP, mDate, fullDataRes.currP);

		    await setData({ticker: fullDataRes.ticker, loading: false});
		    await setPData({yrPrice: startDateData, loading: false});

		    await setSData( {yrSpend: investData.profitList ,totSpend:investData.totSpent, 
		      loading: false, maxS: inMaxS});

		    await setCP({value: fullDataRes.currP, loading: false});
		    await setAvgD({value: roundPrice(investData.avgD),loading: false});
		    var theProf = investData.profitList[investData.profitList.length-1].profit;
		    var totSpend = investData.totSpent;
		    await setProfit({
		      value: roundPrice(theProf) ,
		      totValue:  roundPrice(totSpend+theProf),
		      sharesBought: investData.totStocks,
		      avgDec: investData.avgD, 
		      evStock: investData.evenStock,
		      evSpend: investData.evenPay,
		      principal: investData.totSpent,
		      todaySpend :roundPrice(investData.todayS),
		      minDSpend: 100*(investData.minDSpend),
		      minSpend: inMinS,
		      loading: false

		    });
		    var priceA = await pData.yrPrice.map(item => item[1]);
		    pMin = await (Math.min(...priceA));
		    pMax = await (Math.max(...priceA));
			setLoadOn(false)		  

		  }
		}
		else{
		  await setPData({yrPrice: ['test'], loading: false});
		  await setSDate({theDate: NaN, loading: false});
		  await setData({ticker: 'Invalid input.', loading: false});
	      setLoadOn(false)
		}
  }


 function updateHP(theVal, theBool){

    if (theBool){
      setWGHP({value: theVal})
      setGHP({value: theVal+dGHP.value});
    }else{
      setDGHP({value: theVal})
      setGHP({value: theVal+wGHP.value});
    }
  }

   function getDisplayHP(theHp){
      return( <div style={{marginLeft: "2vw", fontSize: "1.75vw", marginBottom: "2vw"}}>{"Showing relative spend if 50% spent at: "
    }<span style={{color: "lightblue"}}>{theHp+"%"}</span>{" drop from 52wk high"}</div>);

 	}

 function getLoad(){
 	if(loadOn==true){
 		return(
			<><ReactLoading type={"balls"} color={"white"} height={0} width={0} className="loader"/>
			</>
    	);
///    	 			<><ReactLoading type={"balls"} color={"white"} height={"1vw"} width={"2.5vw"} className="loader"/>

 	}else{
 		return(<div style={{color: "black", fontSize:"3vw"}}>HELLOO</div>);
 	}
 }

function getIntro(){
		return(
		<div>
			<h1 style={{fontSize:"3vw", marginLeft: "1vw", color: "lightblue"}}>Introduction</h1>
			<p style={{fontSize:"2vw", marginRight: "2vw", marginLeft: "1vw"}}> 
			In this page users can back test the recurring investment
			algorithm with their input of choice. The interactive relative spend plot
			from the home page is here for user reference. </p>
			<p style={{fontSize:"2vw", marginRight: "2vw", marginLeft: "1vw"}}>Continue to scroll to find the algorithm input and try it yourself!</p> 
			</div>
		)

} 



 return (
    <div>
    <div className = "row">
      <div className = "topRightCol">
        <div>{getIntro()}</div>
      </div>
      <div className = "topLeftCol">
      <div style={{color: "white", marginBottom: "5vw"}}>
         <div style ={{ marginBottom:'2.5vw'}}>
          {returnHPGraph( graphHP.value)}
        </div>
        <div>{getDisplayHP(graphHP.value)}</div>
        <input type="range" id="vol" defaultValue="10" name="vol" min="0" max="99" style={{width: "60%"
      , marginLeft: "2vw"}} onChange={(e)=> updateHP(parseFloat(e.target.value), true)}/>
      <input type="range" id="vol" defaultValue="0" name="vol" min="0" max="99" style={{width: "60%"
      , marginLeft: "2vw", marginTop: "1vw"
      }} onChange={(e)=> updateHP(parseFloat(e.target.value)/100, false)}/>
      </div>
      </div>
    </div>
    <div className = "row">
      <div className = "mainCol">
        <form >
          <div>
            <div>
            <h1 style={{fontSize:"3vw", marginLeft: "2vw", color: "lightblue"}}>Backtesting input</h1>
            <label className = "App">
              Stock ticker:
              <input className = "App" type="text" value={stock} onChange={(e) => inputStock(e.target.value)}/>
            </label>
            <label className = "App">
                Start date: 
                <input className = "App" style = {{width: '12vw'}} type="text" value={inDate} onChange={(e) => inputIDate(e.target.value)}/>
            </label>
            </div>
            <div style={{marginTop: "3vw"}}>
            <label htmlFor="frequency" className = "App">Choose a investment frequency:</label>
            <select className = "App" name="frequencies" id="frequencies" value ={inFreq} onChange={
              (e) => inputIFreq(e.target.value)
            }>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-monthly">Bi-monthly</option>
            </select>
            </div>
          </div>
          <div style={{marginTop: '3vw'}}>
            <label className = "App">
              Min spend:
              <input className = "App" type="text" value={inMinS} onChange={(e) => inputMinS(e.target.value)}/>
            </label>
            <label className = "App">
              Max spend: 
              <input className = "App" type="text" value={inMaxS} onChange={(e) => inputMaxS(e.target.value)}/>
            </label>
            </div>
          `<div style={{marginTop: '1.5vw'}}>
            <label className = "App">
              Percentage decline to spend half %: 
              <input className = "App" type="text" value={inHP} onChange={(e) => inputHP(e.target.value)}/>
            </label>
          </div>
        </form>
        <div style ={{marginTop: '3vw'}}>
          <button  className = "App" type="button" onClick={getGraphData}>Submit Input!</button>
           <label className = "App" style={{textAlign: 'center', marginTop: "3vw", fontSize: '1.2vw', color: 'darkgreen'}}>{getLoad()}</label>
        </div>
         <h2 style={{marginTop: "3vw", marginLeft: "2vw"}}>Previous submission status:</h2>
        <div style ={{marginTop: '1.5vw'}}>
          <label className = "AppSelect" style ={{fontSize: '2vw'}}>Ticker : <span className="BlueSpan" style ={{fontSize: '2vw'}}>{data.loading ? "Waiting for input..." : data.ticker}</span></label>
        </div>
        <div style ={{marginTop: '1.5vw'}}>
          <label className = "AppSelect" style ={{fontSize: '2vw'}}>Start date : <span className="BlueSpan">{sDate.loading ? "Waiting for input..." : 
            isNaN(sDate.theDate)? "Enter a valid date between yesterday and 10 years ago."
            : sDate.theDate.toDateString()}</span></label>
        </div>
        <div style ={{marginTop: '1.5vw'}}>
          <label className = "AppSelect" style ={{fontSize: '2vw'}}>Min spend : <span className="BlueSpan">{minS.loading ? "Waiting for input..." :  isNaN(minS.value) ? minS.value : "$"+roundPrice(minS.value).toLocaleString('en-US')}</span></label>
        </div>
        <div style ={{marginTop: '1.5vw'}}> 
          <label className = "AppSelect" style ={{fontSize: '2vw'}}>Max spend: <span className="BlueSpan">{maxS.loading ? "Waiting for input..." : isNaN(maxS.value) ? maxS.value : "$"+roundPrice(maxS.value).toLocaleString('en-US')}</span></label>
        </div>
        <div style ={{marginTop: '1.5vw'}}>
          <label className = "AppSelect" style ={{fontSize: '2vw'}}>Frequency: <span className="BlueSpan">{inFreq}</span></label>
        </div>
        <div style ={{marginTop: '1.5vw' }}>
          <label className = "AppSelect" style ={{fontSize: '2vw'}}>Percentage to spend half: <span className="BlueSpan">{hpS.loading? "Waiting for input.": hpS.value+"%"}</span></label>
        </div>
        <div style ={{marginTop: '2.5vw'}}>
          {returnPriceGraph( pData, pMin, pMax)}
        </div>
        <div style ={{marginTop: '2.5vw', marginBottom:'2.5vw'}}>
          {returnSpendGraph( spendData)}
        </div>
        <div style ={{marginTop: '2.5vw', marginBottom:'2.5vw'}}>
          {returnComparissonGraph( spendData)}
        </div>
        </div>
        <div className = "rightCol" >{retRightCol(data, currPrice, avg_dec, currProf, pData, roundPrice)}</div>
    </div>
    </div>);






};

export default TryYourself;