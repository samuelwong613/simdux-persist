function sequence(promises, initValue, key){
	return promises.reduce((promise, asyncFun) => {
		return promise.then(preResult=>{
			return asyncFun(preResult, key);
		});
	}, Promise.resolve(initValue));
};

module.exports = sequence;