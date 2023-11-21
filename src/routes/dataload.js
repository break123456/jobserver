const express = require('express');
const readline = require('readline');
const {GSkill, GPreference, GCity} = require('../models/globaldata')
const fs = require('fs');
const path = require('path')

const globalLoadRouter = express.Router();
globalLoadRouter.get('/skills', async (req, res) => {
	let filepath = path.join(__dirname, '../datafiles/skill.txt');
	await GSkill.deleteMany({});

	//return res.status(200).json({path: filepath});
	// Read file line by line and save to database
	const lineReader = readline.createInterface({
	  input: fs.createReadStream(filepath), // Adjust the file path as needed
	});

	let skillObjs = [];

	lineReader.on('line', (line) => {
	  skillObjs.push({name: line.trim()});
	});

	lineReader.on('close', async() => {
		await GSkill.insertMany(skillObjs)
	    .then((result) => {
	      console.log('Skills saved successfully:', result);
	    })
	    .catch((error) => {
	      console.error('Skills saving pincode:', error);
		  return res.status(400).json({error:error.message});

	    });
	  console.log('Finished reading file.');
	});

	return res.status(200).json({success:true});

});

globalLoadRouter.get('/preferences', async(req, res) => {
	let filepath = path.join(__dirname, '../datafiles/preference.txt');
	//return res.status(200).json({path: filepath});
	// Read file line by line and save to database
	const lineReader = readline.createInterface({
	  input: fs.createReadStream(filepath), // Adjust the file path as needed
	});

	let prefObjs = [];

	lineReader.on('line', (line) => {
	  prefObjs.push({name: line.trim()});
	});

	lineReader.on('close', async() => {
		GPreference.insertMany(prefObjs)
	    .then((result) => {
	      console.log('preference saved successfully:', result);
	    })
	    .catch((error) => {
	      console.error('preference saving error:', error);
		  return res.status(400).json({error:error.message});

	    });
	  console.log('Finished reading file.');
	});

	return res.status(200).json({success:true});

});

globalLoadRouter.get('/cities', async(req, res) => {
	let filepath = path.join(__dirname, '../datafiles/cities.json');
	//return res.status(200).json({path: filepath});
	// Read file line
	const rawData = fs.readFileSync(filepath);
	const jsonData = JSON.parse(rawData);
	let cityObjs = [];
	
	for(const lObj of jsonData)
	{
		/*
		cityObjs.push({
			city: lObj.name.trim(),
			state: lObj.state.trim(),
			name: lObj.name.trim()+ ","+ lObj.state.trim()
		});*/
		const lCity = new GCity({
			city: lObj.name.trim(),
			state: lObj.state.trim(),
			name: lObj.name.trim()+ ","+ lObj.state.trim()
		});
		await lCity.save();
	}
	await GCity.insertMany(cityObjs)
	console.log('Finished adding cities');

	return res.status(200).json({success:true});

});


module.exports = globalLoadRouter;