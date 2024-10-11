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
	const rawData = fs.readFileSync(filepath);
	const jsonData = JSON.parse(rawData);

	let skillObjs = [];

	const skillsSet = new Set();

	for(const lObj of jsonData)
	{
		skillsSet.add(lObj.toLowerCase().trim());
	};

	skillsSet.forEach((item) => {
		skillObjs.push({name: item});
	})

	await GSkill.deleteMany({});

	return res.status(200).json({success:true});

});

globalLoadRouter.get('/preferences', async(req, res) => {
	let filepath = path.join(__dirname, '../datafiles/preference.json');
	console.log("filepath:" + filepath);
	//return res.status(200).json({path: filepath});
	// Read file line by line and save to database
	const rawData = fs.readFileSync(filepath);
	const jsonData = JSON.parse(rawData);
	let cityObjs = [];
	//first delete all existing data\
	let prefObjs = [];

	const prefsSet = new Set();

	for(const lObj of jsonData)
	{
		prefsSet.add(lObj.toLowerCase().trim());
	}	

	prefsSet.forEach((item) => {
		prefObjs.push({name: item});
	})

	/*lineReader.on('line', (line) => {
	  console.log("line:" + line.trim());
	  prefObjs.push({name: line.trim()});
	});
	for await (const line of lineReader) {
		// Each line in input.txt will be successively available here as `line`.
		//console.log(`Line from file: ${line}`);
		prefObjs.push({name: line.trim()});

	}*/
	await GPreference.deleteMany({});
	await GPreference.insertMany(prefObjs)

	//console.log("pushed objs:" + prefObjs);
	//first delete existing
	console.log("first preferences are cleared")

	return res.status(200).json({success:true});

});

globalLoadRouter.get('/cities2', async(req, res) => {
	let filepath = path.join(__dirname, '../datafiles/cities.json');
	//return res.status(200).json({path: filepath});
	// Read file line
	const rawData = fs.readFileSync(filepath);
	const jsonData = JSON.parse(rawData);
	let cityObjs = [];
	//first delete all existing data
	await GCity.deleteMany({});
	for(const lObj of jsonData)
	{
		/*
		cityObjs.push({
			city: lObj.name.trim(),
			state: lObj.state.trim(),
			name: lObj.name.trim()+ ","+ lObj.state.trim()
		});*/
		const lCity = new GCity({
			city: lObj.name.toLowerCase().trim(),
			state: lObj.state.toLowerCase().trim(),
			name: lObj.name.toLowerCase().trim()+ ","+ lObj.state.trim()
		});
		await lCity.save();
	}
	//await GCity.insertMany(cityObjs)
	console.log('Finished adding cities');

	return res.status(200).json({success:true});

});

globalLoadRouter.get('/cities', async (req, res) => {
	console.log("cities load started");
    let filepath = path.join(__dirname, '../datafiles/cities.json');

    // Read the file
    const rawData = fs.readFileSync(filepath);
    const jsonData = JSON.parse(rawData);

    let cityObjs = new Set(); // Using Set to ensure unique city names

    // First, delete all existing data in GCity collection
    await GCity.deleteMany({});

    for (const lObj of jsonData) {
        // Create a lowercase name key and add to the Set (to avoid duplicates)
        const nameKey = `${lObj.name.toLowerCase().trim()},${lObj.state.toLowerCase().trim()}`;

        // Ensure we are not adding duplicates by checking the Set
        if (!cityObjs.has(nameKey)) {
            cityObjs.add(nameKey);

            // Save to the MongoDB collection
            const lCity = new GCity({
                city: lObj.name.toLowerCase().trim(),
                state: lObj.state.toLowerCase().trim(),
                name: nameKey
            });
            await lCity.save();
        }
    }

    // Convert Set back to array for writing into the JSON file
    const uniqueCitiesArray = Array.from(cityObjs).map((nameKey) => {
        const [city, state] = nameKey.split(',');
        return { name: city, state };
    });

    // Write the unique cities back to the file
    fs.writeFileSync(filepath, JSON.stringify(uniqueCitiesArray, null, 2), 'utf-8');
    console.log('Finished adding cities and updating the file with unique cities');

    return res.status(200).json({ success: true });
});


module.exports = globalLoadRouter;