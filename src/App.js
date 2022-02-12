import React from "react";
import './App.css';
import {  returnSpyPlotData} from './ProcessStockData.js';
import {
returnHPGraph, returnPeakGraph} from './plottingFormatting.js';

function App() {
  
  
  const [wGHP, setWGHP] = React.useState({value: 10});
  const [dGHP, setDGHP] = React.useState({value: 0});
  const [graphHP, setGHP] =  React.useState({value: 10});
 
  const[ spyData, setSpyData] = React.useState({
    value: ""
  });
  React.useEffect( ()=>
  {
    let isCancelled = false; 
    var todayDate = new Date();
    var spyUrl = "https://recurr-inv-backend-deploy.herokuapp.com/apiGraph?stock=SPY"+"&month="+String(todayDate.getMonth())+"&day="+String(todayDate.getDate())+"&year="+String((todayDate.getFullYear()-1))+"&freq=daily";
    fetch(spyUrl).then((res)=>res.json()).then(
      (thisR)=>returnSpyPlotData(thisR)).then((nowR) => {
      if (!isCancelled) {
        setSpyData({value: nowR});
      }
    });
    return () => {
      isCancelled = true;
    };
  }, []);
  
  
    // ;
    // console.log(fullDataSpy);
    // var plotSpyData = returnSpyPlotData(fullDataSpy);
    // console.log(plotSpyData, "yass again x2");
    // setSpyData({value: plotSpyData})





 
 


 
 
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

  function getPeakParagraph(){
    return( 
      <div style={{marginLeft: "1.5vw", 
      marginTop:"2.5vw", marginRight:"2.5vw", fontSize: "1.75vw", textAlign:"left", color: "white"}}>
          <h2 style={{color: "lightblue"}}>Evaluating Drops</h2>
          <p>{"To understand this buying algorithm, users are first introduced to a stock's"}
          <span style={{color: "lightblue"}}> 52 week high drop</span>
            {". This percentage is computed with the following steps:"}
            </p>  
            <ol>  
              <li>{"Determine the stock's"}
                <span className ="lbSpan"> max price</span> 
                {" in the last 52 weeks."}</li>
              <li>{"Subtract the "}<span className ="lbSpan">{" current price"}</span>
               {" from the max price."}</li>
              <li><span className ="lbSpan">{"Divide"}</span>
              {" the resulting subtraction by the max price."}</li>
            </ol>
            <p>{"The plot the right illustrates current and max price over the last year for the stock ticker"} 
            <span className ="lbSpan">{" SPY"}</span>{". The live 52 week high drop is computed."} </p>        
        </div>);
  };

  function getHPPar(){
        return( <div style={{marginLeft: "1.5vw", marginRight:"2vw", fontSize: "1.75vw", textAlign:"left", color: "white"}}>
          <h2 style={{color: "lightblue"}}>Determining Spend</h2>
          <p>After picking a stock and recurring investment frequency, the amount spent must be determined
          for each purchase.</p>
          <p> First the user must select select three parameters:</p>
          <ol>  
            <li><span className ="lbSpan">{" Min "}</span> 
                {" purchase amount."}</li>
            <li><span className ="lbSpan">{" Max "}</span> 
                {" purchase amount."}</li>
              <li>{"Select the"}
              <span className ="lbSpan">{" 52 wk high drop to spend half of the max."}</span>
              <span style={{fontSize:"1.5vw"}}>{" ( Refer to this parameter as - "}
              <span className ="lbSpan">{"hd "}</span>{")"}</span></li>
            </ol>
         <p>With these three parameters the
          plot to the left is produced. This graph shows the percent spend relative to the max. amount
          as a function of the 52 week high drop in the horizontal axis. </p><p>Therefore, at each purchase time this graph
          is used to determine purchase amount based on the 52 week high drop.   
          </p>
        </div>);
  };


  function getIntroParagraph(){
    return(
    <>
    <h2 style={{textAlign: "center", color: "lightblue", fontSize: "2vw"}}>Introduction</h2>
    <p style={{textAlign: "center", color: "white", fontSize: "1.75vw"
    ,marginLeft:"1vw", marginRight:"2vw"}}>This application was created 
    to share and backtest a <span className="lbSpan">recurring stock purchasing
    algorithm </span>. The goal of the algorithm is to be an alternative to a constant
    recurring investment that provides <span className="lbSpan">better dollar cost averging </span>
    (lower cost per stock purchased).  <span className="lbSpan">This is not financial advice!
    </span>
    </p> 
    </>
    )
  }


  function getBasicsParagraph(){
    return(
    <>
    <h2 style={{textAlign: "center", color: "lightblue", fontSize: "2vw"}}>Basics</h2>
    <p style={{textAlign: "center", color: "white", fontSize: "1.75vw"
    ,marginLeft:"1vw", marginRight:"2vw"}}>The backtesting of the algorithm 
    assumes only stock purchases are made; 
    <span className="lbSpan"> no selling occurs</span>. 
    In addition, <span className="lbSpan">the principal invested is not fixed</span>. Instead, a constant user defined max 
    and min are set for the recurring stock purchases.
    </p>
    </>
    )
  }

   function getAboutParagraph(){
    return(
    <>
    <h2 style={{textAlign: "center", color: "lightblue", fontSize: "2vw"}}>About the site</h2>
    <p style={{textAlign: "center", color: "white", fontSize: "1.75vw"
    ,marginLeft:"1vw", marginRight:"2vw"}}>
    This page introduces the algorithm. The  <span className="lbSpan">Try Now</span> page allows
    users to backtest the algorithm using their own inputs and selected stock.
    Users can save their investment inputs using the  <span className="lbSpan">Sign Up</span> page to created
    a site account. 
    </p>
    </>
    )
  }

  function getCosequences(){
       return(
    <>
    <h2 style={{textAlign: "center", color: "lightblue", fontSize: "2vw"}}>Approach</h2>
    <p style={{textAlign: "center", color: "white", fontSize: "1.75vw"
    ,marginLeft:"1vw", marginRight:"2vw"}}>
      The previous caveat is the reason why one would pick a low half spend drop
      for stocks you want to consistently invest in, even when prices are high. 
      A high half spend drop would be appropriate for a stock
    you only want to purchase during low prices.
    </p>
    </>
    )


  }

  function getMinSPara(){
         return(
    <>
    <h2 style={{textAlign: "center", color: "lightblue", fontSize: "2vw"}}>Min spend</h2>
    <p style={{textAlign: "center", color: "white", fontSize: "1.75vw"
    ,marginLeft:"1vw", marginRight:"2vw", marginBottom: "4vw"}}>
        Many stock exchanges do not allow minimum purchases below one dollar.
        The same is true in this algorithm; note a min spend of zero means 
        some recurring purchases may not occur. If this is non-zero
         the algorithm will make a constant min spend purchase when the year 
        high drop is less than a certain percentage.
   
    </p>
    </>
    )
  }

  function getParamCaveat(){
       return(
    <>
    <h2 style={{textAlign: "center", color: "lightblue", fontSize: "2vw"}}>Half spend drop</h2>
    <p style={{textAlign: "center", color: "white", fontSize: "1.75vw"
    ,marginLeft:"1vw", marginRight:"2vw"}}>
    The chosen 52 week high drop to spend half of the set max is an important 
    percentage to pick. At zero percent the algorithm
    will make a constant recurring max purchase. If the value of this
    drop is increased smaller purchases will be made during bullish periods
    relative to bearish periods. 
    </p>
    </>
    )


  }


  /// var tt = 0;
  // var testStr = ""
  // setInterval(function() {
  //   tt = ++tt % 4;
  //   console.log(tt, "in the tts")
  // }, 800);

  //
  return (
    <div>
    <div className = "row">
       <div className = "thirdCol">{getIntroParagraph()}</div>
       <div className = "thirdCol">{getBasicsParagraph()}</div>
       <div className = "thirdCol">{getAboutParagraph()}</div>
    </div>
    <div className = "row">
      <div className = "leftSmallCol">
        <div >{getPeakParagraph()}</div>
      </div>
      <div className = "topRightBigCol">
        <div >{returnPeakGraph(spyData)}</div>
      </div>
    </div>
    <div className = "row">
      <div className = "topRightCol">
        <div>{getHPPar()}</div>
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
        <h1 style={{color: "lightgrey", fontSize: "3vw", textAlign: "center"}}>Caveats</h1>
       <div className = "thirdCol">{getParamCaveat()}</div>
       <div className = "thirdCol">{getCosequences()}</div>
       <div className = "thirdCol">{getMinSPara()}</div>
    </div>
    </div>
  );
    
}

export default App;

