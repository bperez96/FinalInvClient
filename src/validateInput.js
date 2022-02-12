function validDate(theDate){

	if((Date.now()-theDate)>24*60*60*1000 && (Date.now()-theDate)<3.154e11){
		return true
	}else{
		return false
	}
	
}

function checkHP(inHP){
	var check = false;
	var setter = {};
	inHP = parseFloat(inHP);
    if (isNaN(inHP)){
      setter = {value : "Input numeric value.", loading: false};
    }else if (inHP>=100 || inHP<0){
    	setter = {value : "Input 0<=hp<100.", loading: false};
     }else{
        check = true;
        setter = {value : inHP, loading: false};
     }
     return [check,  setter ];
}

function checkSpend(inMinS, inMaxS){
	var numOk = false;
	var setterMin, setterMax;
	inMinS = parseFloat(inMinS);
	inMaxS = parseFloat(inMaxS);
	if ( (isNaN(inMinS) || isNaN(inMaxS))){
	    setterMin = {value: "Input numeric value.", loading: false};
        setterMax = {value : "Input numeric value.", loading: false};
	}else if((inMaxS<=inMinS) || (inMinS>0 && inMinS<1)||(inMinS<0)|| (inMaxS<=1)){
	    setterMax ={value : "Input max spend>min spend, max spend>1$.", loading: false};
	    setterMin ={value : "Input min spend = $0 or >=$1", loading: false};
	}else{
	    setterMax ={value : inMaxS, loading: false};
        setterMin ={value : inMinS, loading: false};
        numOk = true
	}
	return [numOk, setterMax, setterMin]

}
export{validDate, checkHP, checkSpend};