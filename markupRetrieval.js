//separating out css selectors in order to
const fightOverview = '.c-listing-fight';
const ufcURL = "https://www.ufc.com/events";
const redCornerLastName = '.c-listing-fight__corner-body--red > .c-listing-fight__corner-name > span.c-listing-fight__corner-family-name';
const blueCornerLastName = '.c-listing-fight__corner-body--blue > .c-listing-fight__corner-name > span.c-listing-fight__corner-family-name';
const mainCardLinks = '.c-card-event--result__headline > a';
const fightOdds = 'span.c-listing-fight__odds-amount';

const axios = require("axios");
const cheerio = require("cheerio");
//const sampleData = require("./sampleData");

const d = args => {
  console.log(args);
}

//returns object with 'url' and 'headliner (display friendly name)'
const getFightURLs = async (url) => {
	try {
		//fetch markup
		const response = await axios.get(url);
		//load with cheerio to parse for desired data
		const $ = cheerio.load(response.data);
		//use this to adjust the number of cards that are reviewed
		const numberOfFights = 5;
		let upcomingCards = await $(mainCardLinks).slice(0,numberOfFights).map(function() {
			return {
				headliner: $(this).text(),
				 url:'https://www.ufc.com' + $(this).attr('href')
			 };
		}).toArray();
	//	d(upcomingCards);
		return upcomingCards;
} catch (error) {
 d(error);
}
}

//run this function against each fight card URL to extract matchups + odds
const getFightOdds = async (args) => {
	try {
		const response = await axios.get(args.url);
		const $ = cheerio.load(response.data);
		let fightCardInfo = $(fightOverview).map(function() {
			return {
				lastNameRedCorner: $(this).find(redCornerLastName).text(),
				lastNameBlueCorner: $(this).find(blueCornerLastName).text(),
				oddsRedCorner: $(this).find(fightOdds).slice(0,1).text(),
				oddsBlueCorner: $(this).find(fightOdds).slice(1).text(),
			}
		}).toArray();
		//zero index the name of the card
	  return [args.headliner, ...fightCardInfo];
	} catch (error) {
		d(error + ' is the returned error.');
	}
}

getFightURLs(ufcURL).then(function(cardInfo) {
	//TODO: Actually use the cardInfo rather than hardcoded value
	getFightOdds({
	    headliner: 'Adesanya vs Romero',
	    url: 'https://www.ufc.com/event/ufc-248'
	  }).then(function(fightInfo) {
		d(fightInfo);
	});
});

//const links = $('.c-card-event--result__headline')
//console.log(links);
