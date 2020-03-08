const d = require("./d");

const getFightOdds = async (url) => {
	try {
		const response = await axios.get(url);
		const $ = cheerio.load(response.data);
		console.log($);
		let  fightCardInfo = $('.c-listing-fight__content').map(function() {
			return {
				redCorner: $(this).text(),
				test: 'item',
			}
		}).toArray();

	} catch (error) {
		d(error + ' is the returned error.');
		d(response.code)
	}
}

console.log(getFightOdds('https://www.ufc.com/event/ufc-248'));
