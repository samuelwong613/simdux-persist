import checkConfig from './checkConfig.js';
import sequence from './sequence.js'; 

function dateReplacer(json){
	if (typeof json === 'string' && json.match(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d{3}Z$/))
		return new Date(json);
	else if (typeof json === 'object'){
		Object.keys(json).forEach(key => {
			json[key] = dateReplacer(json[key]);
		})
	}
	return json;
}

module.exports = (store, config)=>{
	let {storage,whitelist,blacklist,transforms,keyPrefix} = checkConfig(config);
	let fields = Object.keys(store._state);

	if (whitelist)
		fields = fields.filter(field => whitelist.some(key => key === field));
	else
		fields = fields.filter(field => blacklist.every(key => key !== field));	

	let transformsReverse = [...transforms];
	transformsReverse.reverse();

	return Promise.all(
		fields.map(field => {
			return storage.getItem(`${keyPrefix}/${field}`)
				.then(value => {
					if (value){
						value = JSON.parse(value).v;
						return sequence( transformsReverse.map(transform => transform.out), value, field )						
					}
				})
				.then( value => {
					if (value)	return dateReplacer(value);
				})				
				.then( value => {
					if (value)	store[field] = value;
				})
		})
	)
	
}