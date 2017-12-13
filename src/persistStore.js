import checkConfig from './checkConfig.js';
import sequence from './sequence.js'; 

module.exports = (config)=>{
	let {storage,whitelist,blacklist,transforms,keyPrefix} = checkConfig(config);

	return (key, prevState, nextState)=>{
		if ((!whitelist && blacklist.every(k => k !== key)) || (whitelist && whitelist.some(k => k === key))){
			let value = nextState[key];

			return Promise.resolve()
				.then( () => sequence( transforms.map(transform => transform.in), value, key ) )
				.then( value => storage.setItem(`${keyPrefix}/${key}`,JSON.stringify({v:value})) );
		}
	}
}