
module.exports = (config) => {
	config = {...config};
	const ALLOW_CONFIG = ['storage','blacklist','whitelist','transforms','keyPrefix'];

	if (typeof config !== 'object' || config.constructor.name !== 'Object')
		throw Error(`simdux-persist: persistStore: must config with object`);

	Object.keys(config).forEach(key => {
		if (ALLOW_CONFIG.every(k => k!==key))
			throw Error(`simdux-persist: persistStore: config.${key} is not supported`);
	})
	
	if (typeof config.storage !== 'object')	throw Error('simdux-persist: persistStore: config.storage must be set');
	if (typeof config.storage.getItem !== 'function' || typeof config.storage.setItem !== 'function' || typeof config.storage.removeItem !== 'function')
		throw Error('simdux-persist: persistStore: config.storage is not a valid storage');

	config.blacklist = config.blacklist || [];
	if (!(config.blacklist instanceof Array) || config.blacklist.some(k => typeof k !== 'string'))
		throw Error('simdux-persist: persistStore: config.blacklist must be a string[]');
	
	config.whitelist = config.whitelist || null;
	if ( (config.whitelist && !(config.whitelist instanceof Array)) ||
			 (config.whitelist instanceof Array && config.whitelist.some(k => typeof k !== 'string')))
	throw Error('simdux-persist: persistStore: config.whitelist must be a string[]');

	config.keyPrefix = config.keyPrefix || 'SIMDUX-PERSIST';
	if (typeof config.keyPrefix !== 'string')
		throw Error(`simdux-persist: persistStore: config.keyPrefix must be a string`);

	if (!(config.transforms instanceof Array))	config.transforms = config.transforms ? [config.transforms] : [];
	if (config.transforms.some( transform => 
		(!transform || typeof transform !== 'object' || typeof transform.in !== 'function' ||  typeof transform.out !== 'function')
	))
		throw Error(`simdux-persist: persistStore: config.transforms must be a transform[], some transform may be invalid`);

	return config;
}
