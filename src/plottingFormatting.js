import React from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer
} from "recharts";

const dateFormatter = date => {
  var pdate =new Date(date*1000);
  var pmonth = pdate.getMonth()+1;
  var pday = pdate.getDate();
  if (pday<10){
    pday ='0'+pday.toString();
  }
  if (pmonth<10){
    pmonth ='0'+pmonth.toString();
  }
  var pyear = pdate.getFullYear();
  var dateStr = pmonth.toString()+'-'+pday.toString()+'-'+pyear.toString().slice(-2);
  return dateStr
};

const priceFormatter = price => {
  var rPrice = Math.round(price * 100) / 100;

  return "$"+rPrice.toLocaleString('en-US') 
};
const regularRound = price => {
  var rPrice = Math.round(price * 100) / 100;
  return rPrice 
};



const CustomProfitTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style= {{backgroundColor: 'white', borderStyle: 'solid', borderWidth: '0.25px', borderColor: 'gray'
        ,color: 'black', fontSize: "2vw"}}>
       <p >{`${"Date: "+dateFormatter(payload[0]?.payload?.date)}`}</p>
       <p >{`${"Profit: "+priceFormatter(payload[0].payload?.value)}`}</p>  
      </div>
    )
   }

  return null
}

function retPortValue(pData){
    
    var placeholder = pData.yrSpend.map((item)=>{return{date: item.date, value: item.profit+pData.totSpend}});
    return placeholder;
    
}

function retComparissonData(pData){
    var initPrice = pData.yrSpend[0].price;
    var placeholder = pData.yrSpend.map((item)=>{return{date: item.date, 
      relSpend: item.daySpend/pData.maxS, relPrice: item.price/initPrice }});
    return placeholder;
    
}

function returnStrokeSpy(pData){
  
  var diff = pData.value[0].price-pData.value[pData.value.length-1].price;
  if (diff<0){
    return "#f20d0d"
  }
  else{
    return "#2d9d20"
  }
};



function returnStroke(pData){
  
  var diff = pData.yrPrice[0].price-pData.yrPrice[pData.yrPrice.length-1].price;
  if (diff<0){
    return "#f20d0d"
  }
  else{
    return "#2d9d20"
  }
};

function retArrow(theBool){
  if (theBool){
    return(<span> &#9650;</span>);
  }else{
      return(<span> &#9660;</span>);
  }
};


function returnPriceGraph(  pData, pMin, pMax){
  var initPrice = pData.yrPrice[pData.yrPrice.length-1].price;

  var CustomPriceTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    var tempProfit = (payload[0].payload?.price-initPrice);
    var tempPerProfit = Math.round(10000*tempProfit/initPrice)/100;
    var colProf = 'green';
    var profBool = true;
    if (tempProfit<0){
      profBool = false;
      colProf = 'red'
    }
    return (
      <div style= {{backgroundColor: 'white', borderStyle: 'solid', borderColor: 'gray'
        ,color: 'black', fontSize: "2vw"}}>
       <p >{`${"Date: "+dateFormatter(payload[0]?.payload?.date)}`}</p>
       <p >{"Price: "+priceFormatter(payload[0].payload?.price)+"\u00A0"}<span style = {{color: colProf}}>{ 
        "("}{retArrow(profBool)}{priceFormatter(tempProfit)+", "+tempPerProfit.toLocaleString('en-US')+"%"}</span>
     }</p>    
      </div>
    )
   }

  return null
  }

     function getNothing(){
    return(<div style={{fontSize:"2vw", textAlign: "center", marginTop: "3vw"}}>{"Date"}</div>)
  }

  return(
  <div style={{marginBottom: '3vw'}}>
    <div style={{textAlign: 'center', marginBottom: '1vw', fontSize: '2vw', marginTop: "2vw"}}>Stock Price</div>
    <ResponsiveContainer width="95%" aspect={1.5} >
      <LineChart
        fontColor= {'white'}
        data={pData.loading ? [] : pData.yrPrice}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          stroke = {'white'}
          dataKey={'date'}
          domain={[pData.yrPrice[0].date, (pData.yrPrice[pData.yrPrice.length-1].date+15*24*360)]}
          type = "number"
          scale = "time"
          tickFormatter={dateFormatter}
        />
        <YAxis
          stroke = {'white'}
          dataKey={'price'}
          domain={[{pMin},{pMax}]}
          type = "number"
          tickFormatter={priceFormatter}
          label={{value: 'Price', angle: -90, fill : 'white', fontSize: '2vw', position: "relative", right:"50%", font: 'Arial'}}
        />
        <Tooltip content={<CustomPriceTooltip />}/>
        <Legend content={getNothing}/>
        <Line type="monotone" dataKey="price" stroke={returnStroke(pData)} dot={null}/>
      </LineChart>
    </ResponsiveContainer> 
  </div>
  );
};

function returnValStroke(pData){
    var currrentP = pData.yrSpend[pData.yrSpend.length-1].profit;
    if (currrentP>=0){
      return "#2d9d20"
    }else{
      return "#f20d0d"
    }

}


function returnSpendGraph(  pData ){
  var marketValList =  retPortValue(pData);

  var spendArray = marketValList.map(item =>item.value);
  var spendMin = Math.min(...spendArray);
  var spendMax = Math.max(...spendArray);
  

  const CustomProfitTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    var initVal = spendArray[0];
    var tempProfit = (payload[0].payload?.value-initVal);
    var tempPerProfit = Math.round(10000*tempProfit/initVal)/100;
    var colProf = 'green';
    var profBool = true;
    if (tempProfit<0){
      profBool = false;
      colProf = 'red'
    }
    return (
      <div style= {{backgroundColor: 'white', borderStyle: 'solid', borderWidth: '0.25px', borderColor: 'gray'
        ,color: 'black', fontSize: "2vw"}}>
       <p >{`${"Date: "+dateFormatter(payload[0]?.payload?.date)}`}</p>
       <p >{"Value: "+priceFormatter(payload[0].payload?.value)+"\u00A0"}<span style = {{color: colProf}}>{ 
        "("}{retArrow(profBool)}{priceFormatter(tempProfit)+", "+tempPerProfit.toLocaleString('en-US')+"%"}</span>
     }</p>  
      </div>
    )
   }

  return null
  }

  function getNothing(){
    return(<div style={{fontSize:"2vw", textAlign: "center", marginTop: "2vw"}}>Date</div>)
  }

  return(
   <div style={{marginBottom: '3vw', marginRight: "2vw"}}>
    <div style={{textAlign: 'center', marginBottom: '1vw', fontSize: '2vw'}}>Portfolio Market Value</div>
      <ResponsiveContainer width="80%" aspect={1.5}>
        <LineChart
          fontColor={"white"}
          data={pData.loading ? [] : marketValList}
          margin={{
            top: 5,
            right: 0,
            left: 75,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            stroke = {'white'}
            dataKey={'date'}
            domain={[marketValList[0].date, (marketValList[marketValList.length-1].date+15*24*360)]}
            type = "number"
            scale = "time"
            tickFormatter={dateFormatter}/>
          <YAxis 
            stroke= {'white'}
            dataKey={'value'}
            domain={[{spendMin},{spendMax}]}
            type = "number"
            tickFormatter={priceFormatter}
            label={{value: 'Value', angle: -90, fill : 'white', fontSize: '1.75vw', dx: -75 , font: 'Arial'}}
          />
          <Tooltip content={<CustomProfitTooltip />}  />
          <Legend content = {getNothing}/>
          <Line type="monotone" dataKey="value" stroke={returnValStroke(pData)} dot={null}/>
        </LineChart>
        </ResponsiveContainer>
      </div>
  );
};


function returnComparissonGraph(  pData ){
  var marketValList =  retComparissonData(pData);
  var relSpendList = marketValList.map(item => item.relSpend);
  var relPriceList = marketValList.map(item => item.relPrice);
  var wholeList = [...relSpendList, ...relPriceList];
  var minRel = Math.min(...wholeList);
  var maxRel = Math.max(...wholeList);
   function getNothing(){
    return(<div style={{fontSize:"2vw", textAlign: "center"}}>{"Date"}</div>)
  }

  const CustomComparissonTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
 
    return (
      <div style= {{backgroundColor: 'white', borderStyle: 'solid', borderColor: 'gray'
        ,color: 'black', fontSize: "2vw"}}>
       <p >{`${"Date: "+dateFormatter(payload[0]?.payload?.date)}`}</p>
       <p >{"Relative Price: "+Math.round(payload[0].payload?.relPrice*100)/100+"\u00A0"}</p>
       <p >{"Relative Spend: "+Math.round(payload[0].payload?.relSpend*100)/100+"\u00A0"}</p>
      </div>
    )
   }

  return null
  }


  return(
   <div style={{marginBottom: '3vw'}}>
    <div style={{textAlign: 'center', marginBottom: '1vw', fontSize: '2vw'}}>Comparisson Graph</div>
      <ResponsiveContainer width="95%" aspect={1.5}>
        <LineChart
          fontColor={"white"}
          data={pData.loading ? [] : marketValList}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            stroke = {'white'}
            dataKey={'date'}
            domain={[marketValList[0].date, (marketValList[marketValList.length-1].date+15*24*360)]}
            type = "number"
            scale = "time"
            tickFormatter={dateFormatter}
            label={{value: 'Date', fill : 'white', dy: 25, dx: 100, fontSize: '1.75vw'}}
          />
          <YAxis
            stroke= {'white'}
            domain={[{minRel},{maxRel}]}
            type = "number"
            tickFormatter={regularRound}
            label={{value: 'Normalized Value', angle: -90, fill : 'white', fontSize: '1.75vw', dx: -25 , font: 'Arial'}}
          />
          <Tooltip content={<CustomComparissonTooltip />}  />
          <Legend />
          <Line type="monotone" dataKey="relPrice"  stroke="lightblue" dot={null}/>
          <Line type="monotone" dataKey="relSpend" stroke="magenta" dot={null}/>
        </LineChart>
        </ResponsiveContainer>
              <div style={{fontSize: "1.5vw", marginLeft: "4vw", marginTop: "2vw"}}>This is the price
               relative to the start date price. Relative spend tracks the purchase amount made 
               at each date relative to the max spend.</div>
      </div>
  );


};

function returnPeakGraph(spyData){

   function getNothing(){
    return(<div style={{fontSize:"2vw", textAlign: "center"}}>{"Date"}</div>)
  }

  var spyPList;
  var spyMaxP; 
  var spyMinP; 
  var initPrice; 

  if(spyData.value){
    
    var spyPList = spyData.value.map(item => item.price)
    var spyMaxP = Math.max(...spyPList); 
    var spyMinP = Math.min(...spyPList); 
    var initPrice = spyData.value[spyData.value.length-1].price;
  }else{
    spyData = {value:[{date: 0, price: 0}]};
    var spyPList = [];
    var spyMaxP = 10; 
    var spyMinP = 0; 
    var initPrice = 0;
  }
  
  var CustomPriceTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    var tempProfit = (payload[0].payload?.price-initPrice);
    var tempPerProfit = Math.round(10000*tempProfit/initPrice)/100;
    var colProf = 'green';
    var profBool = true;
    if (tempProfit<0){
      profBool = false;
      colProf = 'red'
    }
    return (
      <div style= {{backgroundColor: 'white', borderStyle: 'solid', borderWidth: '0.25px', borderColor: 'gray'
        ,color: 'black', fontSize: "2vw"}}>
       <p >{`${"Date: "+dateFormatter(payload[0]?.payload?.date)}`}</p>
       <p >{"Price: "+priceFormatter(payload[0].payload?.price)+"\u00A0"}<span style = {{color: colProf}}>{ 
        "("}{retArrow(profBool)}{priceFormatter(tempProfit)+", "+tempPerProfit.toLocaleString('en-US')+"%"}</span>
     }</p>    
      </div>
    )
   }

  return null
  }



  const CustomizedDot = (props) => {
  const { cx, cy, stroke, payload, value } = props;

  if (value == spyMaxP) {
    return(
      <circle cx={cx} cy={cy} r="0.5vw" fill="white" />
    );
    }else if (value == spyData.value[0].price){
      return(<circle cx={cx} cy={cy} r="0.5vw" fill="blue" />)
    }
    else{
      return(null)
    }
  };

  function getSpyHeader(){
    var todayDec = Math.round(10000*(spyMaxP-spyData.value[0].price)/spyMaxP)/100;
    if (todayDec<0){
      todayDec = 0;
    }
    return(
   <div style={{textAlign: 'center', marginBottom: '2vw', fontSize: '2vw'}}>   
    <div >{"Price of"}<span style={{color: "lightblue",  marginBottom: '1.5vw'}}>{" SPY"}</span>{" over the last year "}</div>
    <div>{"Today's 52 week high drop: "}<span style={{color: "lightblue"}}>{todayDec+"%"}</span></div>
    </div>
    )
  }

    return(
   <div style={{marginBottom: '3vw', marginTop: "3vw", marginLeft: "5vw"}}>
      <div>{spyData.value==0 ? " " : getSpyHeader()}</div>   
     <ResponsiveContainer width="90%" aspect={1.5}>
        <LineChart
          fontColor={"white"}
          data={spyData.value==0 ? [] : spyData.value}
          margin={{
            top: 0,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            stroke = {'white'}
            dataKey={'date'}
            type = "number"
            scale = "time"
            domain={[spyData.value[0].date, (spyData.value[spyData.value.length-1].date*1.01)]}
            tickFormatter={dateFormatter}
          />
          <YAxis
            stroke= {'white'}
            type = "number"
            label={{value: 'Price', angle: 0, fill : 'white', fontSize: '1.5vw',position: "relative", left:"2vw", font: 'Arial'}}
            domain = {[spyMinP, (spyMaxP*1.03)]}
            tickFormatter={priceFormatter}
          />
          <Legend content = {getNothing}/>
          <Tooltip content={<CustomPriceTooltip />}/>
          <Line type="monotone" dataKey="price"  stroke={returnStrokeSpy(spyData)} dot={<CustomizedDot />}/>
        </LineChart>
        </ResponsiveContainer>
      </div>
  );
}




function returnHPGraph( gHP){
  var cHP = gHP/100;
  var gHPList = [];
  function computePercentS(currD){
    if (gHP == 0){
      return 1;
    }
    var denom_a = cHP/(1-cHP);
    var denom = denom_a*(1-currD)+currD;
    var theP = currD/denom;
    return theP;
  };
  for( var i = 0; i<4; i++){
    var currDec = i/400;
    gHPList.push({dec:currDec*100, funcVal: 100*computePercentS(currDec)})
  }
  for( var i = 1; i<10; i++){
    var currDec = i/100;
    gHPList.push({dec:currDec*100, funcVal: 100*computePercentS(currDec)})
  }
  for( var i = 10; i<40; i+=5){
    var currDec = i/100;
    gHPList.push({dec:currDec*100, funcVal: 100*computePercentS(currDec)})
  }
   for( var i = 40; i<=100; i+=10){
    var currDec = i/100;
    gHPList.push({dec:currDec*100, funcVal: 100*computePercentS(currDec)})
  }
  gHPList.push({dec:gHP, funcVal: 100*computePercentS(gHP/100)})
  gHPList.sort(function (a,b){return a.dec - b.dec});

  const CustomHPTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
 
    return (
      <div style= {{backgroundColor: 'white', borderStyle: 'solid', borderWidth: '0.25px', borderColor: 'gray'
        ,color: 'black', fontSize: "2vw"}}>
       <p >{"52 wk high drop: "+Math.round(payload[0]?.payload?.dec*100)/100+"%"}</p>
       <p >{"Percent Spend: "+Math.round(payload[0].payload?.funcVal*100)/100+"%"}</p>
      </div>
    )
   }

  return null
  }
  function getNothing(){
    return(<div style={{fontSize:"2vw", textAlign: "center"}}>{"52 week high drop"}</div>)
  }

  const CustomizedDot = (props) => {
  const { cx, cy, stroke, payload, value } = props;

  if (value == 50) {
    return(
      <circle cx={cx} cy={cy} r="0.5vw" fill="red" />
    );
    }else{
      return(null)
    }
  };

  const GetYAxis = ()=>{
    return(<div style={{color: "white"}}>YAXISS</div>);
  }
  return(
   <div style={{marginBottom: '3vw', marginTop: "3vw"}}>
    <div style={{textAlign: 'center', marginBottom: '1.5vw', fontSize: '2vw'}}>Relative spend plot</div>
      <ResponsiveContainer width="95%" aspect={1.5}>
        <LineChart
          fontColor={"white"}
          data={gHPList}
          margin={{
            top: 0,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            stroke = {'white'}
            dataKey={'dec'}
            type = "number"
            tickFormatter={(item)=>item+"%"}
          />
          <YAxis 
            stroke= {'white'}
            type = "number"
            label={{value: 'Percent spend testingg', angle: -90, fill : 'white', fontSize: '1.75vw', font: 'Arial'}}
            tickFormatter={(item)=>item+"%"}
          />
          <Legend content = {getNothing}/>
          <Tooltip content={<CustomHPTooltip />}  />
          <Line type="monotone" dataKey="funcVal"  stroke="lightblue" dot={<CustomizedDot />}/>
        </LineChart>
        </ResponsiveContainer>
      </div>
  );
};


 /// stroke= {'white'}
 //            type = "number"
 //            label={{value: 'Percent spend', angle: -90, fill : 'white', fontSize: '1.75vw', position: "left", offset: {45}, font: 'Arial'}}
 //            tickFormatter={(item)=>item+"%"}



export{dateFormatter, priceFormatter, returnStroke, returnHPGraph,
returnPeakGraph, returnPriceGraph, returnSpendGraph, returnComparissonGraph};