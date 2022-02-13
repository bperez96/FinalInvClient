import React from "react";
import './SecondPage.css';
import { getStockInvestment , retComputationSet} from './ProcessStockData.js';
import { validDate, checkHP, checkSpend } from './validateInput.js';
import { returnPriceGraph, returnSpendGraph, returnComparissonGraph, returnHPGraph } from './plottingFormatting.js';
import {retRightCol} from './rightColResults.js';
import ReactLoading from 'react-loading';




function SecondPage(){
	const [stock, setStock] = React.useState("SPY");
	const [inDate, setIDate] = React.useState("10/10/20");
	const [inMinS, setInMinS] = React.useState(0);
	const [inMaxS, setInMaxS] = React.useState(10);
	const [inFreq, setInFreq] = React.useState("daily");
	const [inUser, setInUser] = React.useState("");
	const [inPassw, setInPassw] = React.useState("");



	const [wGHP, setWGHP] = React.useState({value: 10});
 	const [dGHP, setDGHP] = React.useState({value: 0});
 	const [graphHP, setGHP] =  React.useState({value: 10});

	const [inHP, setInHP] = React.useState(0.25);
	const [sDate, setSDate] = React.useState({
	theDate: "MM/DD/YYYY",
	loading: true,
	microDate: NaN
	});
	;


	const [userName, setUserName] = React.useState( {
		loggedIn: false,
		value: ""
	});

	React.useEffect( ()=>
  {
   function getSessUser(){ 
   		var sessUser =  sessionStorage.getItem("sessUser");
  		if (sessUser!=null){
  				setUserName({
  					loggedIn: true,
						value: sessUser
  				});
  				var savedId = sessionStorage.getItem("sessID");
  				getStockList(savedId); 
  		}
  		console.log(sessUser, "chek me outt")
  	};
  	getSessUser();
  }, []);

	const [avg_dec, setAvgD] = React.useState({
	  value: "",
	  loading: true
	});

	const [pickedStocks, setStockList] = React.useState({
	  value: [],
	  loading: true
	});

	const [statusList, setStatusList] = React.useState({
	  value: [],
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
	value: 0,
	loading: true
	});
	const [maxS, setMaxS] = React.useState({
	value: 0,
	loading: true
	});
	const [minS, setMinS] = React.useState({
	value: 0,
	loading: true
	})
	const [data, setData] = React.useState({
	ticker: "",
	loading: true
	});
	const [pData, setPData] = React.useState({
	yrPrice: ['test'],
	loading: true
	});

	const [spendData, setSData] = React.useState({
	yrSpend: ['test'],
	loading: true
	});

	const [loadOn, setLoadOn] = React.useState(false);


	var stockYrUrl = "";

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
 
  var pMax = 0;
  var pMin = 0;
  var theProf;

  function roundPrice(val){
    var tempVar = Math.round(val*100)/100;
    return tempVar;
  }

  async function deleteStock(num){
  	await disableButt();
  	console.log(num, "yass queen")
  	var delUrl = 'https://recurr-inv-backend-deploy.herokuapp.com/deleteStock?id='+num.id;
  	var delRes = await fetch(delUrl, {
		method: "POST"
	}).then((res)=>res.json());
  	await getStockList(userName.id);
  	var timeout =  setTimeout(enableButt(),50000);
  	
  }






function Garage() {
  var count = 0;

  function retButtonText(pickedS){	
 	return(
 			<span>{"A "}<span className="spanLB">{pickedS.freq}</span>
 			{" investment in "}
			<span className="spanLB">{pickedS.ticker}</span>
			{" starting on "}
 			<span className="spanLB">{(new Date(pickedS.startDate)).toLocaleDateString()}</span>
 			{". Spending "}<span className="spanLB">{"$"+pickedS.minSpend.toLocaleString('en-US')}</span>
 			{" to "}<span className="spanLB">{"$"+pickedS.maxSpend.toLocaleString('en-US')}</span>
 			{" and half "}<span className="spanLB">{"($"+(pickedS.maxSpend/2).toLocaleString('en-US')+")"}</span>
 			{" at a decline of "}<span className="spanLB">{pickedS.hp+"%."}</span>
 			</span>
 	)
 }
  
 
  return (
    <>
      <h1 style={{color: "white", marginLeft: "2vw", fontSize:"3.5vw"
    }}>Investment List</h1>
      <ul>
        {pickedStocks.value.map((car, i) =>{
        	return(
         	<li  key={i.toString()}>
         		<div style={{ color: "white", border: "1.5px solid darkgray",
  borderRadius: "5px", padding: "2vw 1vw", width: "90%", height:"10vw", fontSize: "2vw"}}>{retButtonText(pickedStocks.value[i])}
	    		<button style={{ border: "none", backgroundColor: "#4CAF50", padding: "0.5vw 1vw", borderRadius: "5%", marginLeft: "1vw", fontSize: "1.5vw"}} type="button" onClick = {()=>
	    			getGraphData(pickedStocks.value[i])}>Compute Results </button>
     			<button style={{ border: "none", backgroundColor: "#f44336", padding: "0.5vw 1vw", borderRadius: "5%", marginLeft: "1vw", fontSize: "1.5vw"}} type="button" onClick = {()=>
     			deleteStock(pickedStocks.value[i])}>Delete </button>
		    	</div>
		    </li> );
        })}
      </ul>
    </>
  );
}




 
  async function getGraphData(invObject){ 
  	setLoadOn(true);
    var mDate =  invObject.startDate;
		var theTicker = invObject.ticker;
		var aDate = new Date(mDate);
		console.log(invObject, "in the new method date")
		var theFreq = invObject.freq;  		
	  	stockYrUrl = "https://recurr-inv-backend-deploy.herokuapp.com/apiGraph?stock="+theTicker.trim().toUpperCase()+"&month="+aDate.getMonth()+"&day="+aDate.getDate()+
	    		"&year="+aDate.getFullYear()+"&freq="+theFreq;
	  var fullDataRes = await fetch(stockYrUrl).then((res)=>res.json());
	  if ( fullDataRes.message == "Invalid stock search"){
	      await setPData({yrPrice: ['test'], loading: false});
	      await setData({ticker: 'Invalid stock input.', loading: false});
	      setLoadOn(false);
   
	  }else{
	    var compSetHolder = retComputationSet(fullDataRes);
	    var startDateData = compSetHolder[0];
	    var startDateDataYrP = compSetHolder[1];

	    var investData = getStockInvestment(startDateData, startDateDataYrP,
	     invObject.minSpend, invObject.maxSpend, invObject.hp, mDate, fullDataRes.currP);

	    await setData({ticker: fullDataRes.ticker, loading: false});
	    await setPData({yrPrice: startDateData, loading: false});

	    await setSData( {yrSpend: investData.profitList ,totSpend:investData.totSpent, 
	      loading: false, maxS: invObject.maxSpend});

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
	      minSpend: invObject.minSpend,
	      loading: false
	    });
	    var priceA = await pData.yrPrice.map(item => item[1]);
	    pMin = await (Math.min(...priceA));
	    pMax = await (Math.max(...priceA));
	    setLoadOn(false);
	    
	   

	  }
  }

async function getStockList(theId){
	var getStocksUrl = "https://recurr-inv-backend-deploy.herokuapp.com/getStockList?userId="+theId;
	var stockListRes = await fetch(getStocksUrl).then((res)=>res.json());
	console.log(stockListRes, "todays work")
	var testL = [1,"a","s","d",4];
	console.log(typeof(testL))
	await setStockList(stockListRes)
}

 function getDisplayHP(theHp){
      return( <div style={{marginLeft: "2vw", fontSize: "1.75vw", marginBottom: "2vw"}}>{"Showing relative spend if 50% spent at: "
    }<span style={{color: "lightblue"}}>{theHp+"%"}</span>{" drop from 52wk high"}</div>);

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

async function disableButt(){
	console.log("helloButt");
	var allButton = document.querySelectorAll('button');
	allButton.forEach(function(userItem) {
  		userItem.disabled = true;
	});
	console.log(allButton)
}


async function enableButt(){
	console.log("helloButt");
	var allButton = document.querySelectorAll('button');
	allButton.forEach(function(userItem) {
  		userItem.disabled = false;
	});
	console.log(allButton, "enalberr")
}


function returnStatusList(){
	
	function retButtonText(pickedS){	
	 	return(
 			<label style={{color:"white"}}>{pickedS}</label>
	 	)
 	}
  

	return(
		<>
		<div style={{marginTop: "3vw", marginLeft: "2.5vw", fontSize: "2vw"}}>Status of previous submission:</div>
		<ul>
		    {statusList.value.map((car, i) =>{
		    	return(
		     	<li >
		     		<div style={{ color: "white", border: " solid black",
		borderRadius: "5px", padding: "1vw 0.5vw", width: "40%", height:"6vw", fontSize: "2vw"}}>{retButtonText(statusList.value[i])}
			    	</div>
			    </li> );
		    })}
		</ul>
		</>
	);
	
}


function returnStockInputandStatus(){
	return(
	<div>
		<h1 style={{fontSize: "3.5vw"}}>Investment Input</h1>
        <form >
          <div style={{marginTop: "4vw"}}>
            <label className = "SecondPage" >
              Stock ticker:
              <input className = "SecondPage" type="text" value={stock} onChange={(e) => inputStock(e.target.value)}/>
            </label>
           </div>
           <div style={{marginTop: "3vw"}}>
            <label className = "SecondPage">
                Start date: 
                <input className = "SecondPage" style = {{width: '12vw'}} type="text" value={inDate} onChange={(e) => inputIDate(e.target.value)}/>
            </label>
          </div>
          <div style={{marginTop: '2.5vw'}}>
            <label htmlFor="frequency" className = "SecondPage">Choose a investment frequency:</label>
            <select className = "SecondPage" style={{size: "2vw"}} name="frequencies" id="frequencies" value ={inFreq} onChange={
              (e) => inputIFreq(e.target.value)
            }>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="bi-monthly">Bi-monthly</option>
            </select>
          </div>
          <div style={{marginTop: '2.5vw'}}>
            <label className = "SecondPage">
              Min spend:
              <input className = "SecondPage" type="text" value={inMinS} onChange={(e) => inputMinS(e.target.value)}/>
            </label>
            </div>
           <div style={{marginTop: "3vw"}}>
            <label className = "SecondPage" >
              Max spend: 
              <input className = "SecondPage" type="text" value={inMaxS} onChange={(e) => inputMaxS(e.target.value)}/>
            </label>
          </div>
          <div style={{marginTop: '2.5vw'}}>
            <label className = "SecondPage">
              Percentage decline to spend half %: 
              <input className = "SecondPage" type="text" value={inHP} onChange={(e) => inputHP(e.target.value)}/>
            </label>
          </div>
        </form>
        <div style ={{marginTop: '1.5vw'}}>
          <button  className = "SecondPage" type="button" onClick={addStock}>Add to my list!</button>
        </div>
        <div>{returnStatusList()}</div>
       </div>		
	)
}

async function addStock(){
	await disableButt()
	var checkDate = new Date(inDate);
	var numDate =  (checkDate.valueOf());
    var hpRec = checkHP(inHP)
    var hpValid = hpRec[0];
    var spendCheckList = checkSpend(inMinS, inMaxS);
    console.log(spendCheckList, "rawr")
    var spendValid = spendCheckList[0];
    var dateValid = validDate(numDate);
    var numsValid = false;
    console.log(dateValid, "hello");
    if (spendCheckList[0]==false){
    	await setMaxS(spendCheckList[1]);
    	await setMinS(spendCheckList[2]);
    }
    var tickerValid = false;
    if(dateValid == false){
    	await setSDate({theDate: checkDate, loading: false}); 
    	console.log(checkDate);
    }
    if(hpValid==false){
    	console.log(hpRec, "hpcheckk")
    	await setHPS(hpRec[1])
    }
    if (dateValid && spendValid && hpValid){
    	numsValid = true;
    	console.log("everthing settt")
    }
	if (numsValid){
		var valUrl = "https://recurr-inv-backend-deploy.herokuapp.com/validStock?stock="+stock.trim().toUpperCase();
		var stockValRes = await fetch(valUrl).then((res)=>res.json());
		if (stockValRes.success){
			tickerValid = true;
			var addUrl = "https://recurr-inv-backend-deploy.herokuapp.com/addStock?stock="+stock.trim().toUpperCase()+"&userId="+userName.id+
				"&inDate="+numDate+"&inMinS="+inMinS+"&inMaxS="+inMaxS+
				"&inFreq="+inFreq+"&inHp="+inHP;
			var stockAddRes = await fetch(addUrl).then((res)=>res.json());
			console.log(stockAddRes)
		}else{
			console.log('neigh');
		}
		 if (stockAddRes.success){

			await getStockList(userName.id);
		}
	}
	var allStatusList = ["Invalid input, see list below.", "Input min. spend =$0 or >=$1."
	,"Input max spend > min spend", "Input date between yesterday and 10 years ago.",
	"Input percentage for half spend 0% <= hp < 100%."];
	async function updateStatus(){
		var returnList = [];
		if(numsValid && tickerValid){
			returnList = ["Your last submission was successful."];
		}else{
			var boolList = [];
			 boolList[0] = tickerValid;
			 boolList[1] =  spendValid;
			 boolList[2] = spendValid;
			 boolList[3] =  dateValid;
			 boolList[4] =  hpValid;
			console.log(boolList, "daBullList")
			var i = 0;
			for (var tt = 0; tt<5; tt++){
				if (!boolList[tt]){
					returnList[tt]=allStatusList[tt];
				}
			}
		}
		console.log(returnList, "display list");
		await setStatusList({value: returnList, laoding: false})
	}
	await updateStatus();
	await enableButt();
}
 
async function logIn(){
	var loginRes = await fetch("https://recurr-inv-backend-deploy.herokuapp.com/login?username="+inUser+"&password="+inPassw,{
		method: "POST"
	}).then((res)=>res.json());
	console.log(loginRes,"test1")
	await setUserName(loginRes)
	console.log(userName.id, loginRes.id, "test2")
	await getStockList(loginRes.id);
	console.log(userName, loginRes.id, "test3")
	await sessionStorage.setItem("sessUser", loginRes.value );
	await sessionStorage.setItem("sessID", loginRes.id );

}

async function signUp(){
	var uniqueCheck = await fetch("https://recurr-inv-backend-deploy.herokuapp.com/cansignup?username="+inUser+"&password="+inPassw,{
		method: "POST"
		}).then((res)=>res.json());
	console.log(uniqueCheck)
	if (uniqueCheck.execute){
		var exeSignUp = await fetch("https://recurr-inv-backend-deploy.herokuapp.com/signup?username="+inUser+"&password="+inPassw,{
		method: "POST"
		}).then((res)=>res.json());
		console.log(exeSignUp, "signed up");
		var loginRes = await fetch("https://recurr-inv-backend-deploy.herokuapp.com/login?username="+inUser+"&password="+inPassw,{
				method: "POST"}).then((res)=>res.json());
		console.log(loginRes, "logged in")
		setUserName(loginRes)
		await getStockList(loginRes.id);
		await sessionStorage.setItem("sessUser", loginRes.value );
		await sessionStorage.setItem("sessID", loginRes.id );
	}else{
		setUserName({loggedIn: false, username: ""});
	}

}

function getLoginForm(){
 	return(
 		<div>
 		<h1 style={{marginLeft: "3.5vw", fontSize: "3vw", color: "lightblue"}}>Login Form</h1>
 				<div style={{marginBottom: "2vw", color: "white"}}>Username: 
			<input style={{marginLeft: "3.5vw", width: "25vw", fontSize: "2.5vw"}} type="text" name="username" value={inUser} onChange={(e) => setInUser(e.target.value)} required/>
			</div>
				<div style={{marginBottom: "2vw", color: "white"}}>Password: 
			<input style={{marginLeft: "3.5vw", width: "25vw", fontSize: "2.5vw"}} type="password" name="password" value={inPassw} onChange={(e) => setInPassw(e.target.value)} required/>
				</div>
			<div>
			<button style={{marginTop: "2vw", marginLeft: "3.5vw", width: "15vw", fontSize: "2vw"}} type="button" onClick={logIn}>Log In</button>
			</div>
			<div>
			<button type="button" onClick={signUp} style={{marginTop: "2vw", marginLeft: "3.5vw", width: "15vw", fontSize: "2vw"}}>Sign Up</button>
				</div>
		</div>
 	)
 }

 		/// 	<>
 		// 		<div style ={{fontSize: "3vw", color: "white"}}>Welcome {userName.value}</div>
 		// 		<button type="button" style ={{fontSize: "3vw", color: "white"}}>Log Off</button>
 		// 	</>
 		 ///	);

 function logOff(){
 	console.log("hey queenyy")
	sessionStorage.clear();
	setUserName({loggedIn: false, username: ""});
};
// 	 
// }

function getIntro(){
		return(
		<div>
			<h1 style={{fontSize:"3vw", marginLeft: "1vw", color: "lightblue"}}>Introduction</h1>
			<p style={{fontSize:"2vw", marginRight: "2vw", marginLeft: "1vw"}}> 
			This is your user page. Here you can store back testing
			cases for future reference. These will update with current prices. </p>
			<p style={{fontSize:"2vw", marginRight: "2vw", marginLeft: "1vw"}}>
			Scroll down to add to your list of back testing cases
			 and compute live updates. The interactive relative spend plot is included for user reference. 

			</p>
			</div>)

}

function getTopRow(){
 		 return(
 		<div style ={{padding: "5vw 4vw"}}>
		<label style ={{fontSize: "3.5vw", color: "white"}}>{"Welcome "}<span style={{color: "lightblue"}}>{userName.value}!</span></label>
		<button type="button"  className="logOffButton" onClick = {logOff} >Log off</button>
		</div>
		);
 
};

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


  console.log(userName)
	if (userName.loggedIn== true){
	  return (
	  	<div>
	  		<div style={{color:"red"}}>{getTopRow()}</div>
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
	  			<div className = "topMainCol">	
	  				<Garage/>
	  			</div>
	  			<div className = "topMainCol">{returnStockInputandStatus()}</div>
	  		</div>
	    <div className = "row">
	    	<div>{getLoad()}</div>
	      <div className = "mainCol">
	        <div style ={{marginTop: '0.5vw'}}>
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
	    </div>
	  );
	}else{
		return (<div style={{color:"white"}}>{getLoginForm()}</div>);	
	}
    
}
	


export default SecondPage;