const fs = require('fs');
const path = require('path')

async function importcommand(filepath) {
   let importedCount = 0;
   let skippedCount = 0;
   let sanitizedCount = 0;
   
   try{
    const data = fs.readFileSync(filepath, 'utf8').split('\n');

    data.forEach(line => {
        line = line.trim();
        if(!line) {
            skippedCount++;
        } else if(line.includes('password') || line.includes('secret') || line.includes('token')){
            sanitizedCount++;
        } else {
            importedCount++;
        }
    });

    console.log("\n CMD-TRACKER IMPORT SUMMARY");
    console.log("-----------------------------");
    console.log(`✅Successfully Imported : ${importedCount}`);
    console.log(`⚠️Skipped (Duplicates) : ${skippedCount}`);
    console.log(`🔒Sanitized (Secrets) : ${sanitizedCount}\n`);
   } catch(err) {
    console.error("Error:", err.message);
   }
}

module.exports = { importcommand };