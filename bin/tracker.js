#!/usr/bin/env node
// "Hey! Run this file using Node.js"

/*
 * This is the ENTRY POINT of our CLI tool
 * When user types "tracker" in terminal, this file runs first
 * Think of it like the main gate of our entire application
 */

/*Current commands:
 * tracker init        → sets up .tracker folder in user's repo
 * tracker save <cmd>  → saves a command (called by shell hook)
 *
 * Coming soon:
 * tracker list   → show all saved commands
 * tracker stats  → show command statistics
 * tracker search → search saved commands
*/

// Import commander - this package helps us build CLI commands easily
// Like "list", "stats", "search" etc.
const { program } = require('commander');

// Import package.json to read our version number
// __dirname = current folder path (bin/)
// ../ = go one level up (to root of project)
const packageJson = require('../package.json');

/*
 * Import our init command function
 * This is the function that runs when user types: tracker init
 *
 * We import FROM src/commands/init.js
 * bin/ → go up one level → ../
 * then into src/commands/init.js
 */
const { initCommand } = require('../src/commands/init');
const { importCommand } = require('../src/commands/import');

/*
 * Import our save command function
 * This runs automatically via shell hook every time
 * user types a command in terminal
 */
const { saveCommandAction } = require('../src/commands/save');
// Import list command function
const { listCommand } = require('../src/commands/list');
// Import search command function
const { searchCommand } = require('../src/commands/search');
const { statsCommand } = require('../src/commands/stats');
const { clearCommand } = require('../src/commands/clear');
const { exportCommand } = require('../src/commands/export');

program
    .command('import <file>')
    .description('Import commands from a file')
    .action(importCommand);
const { hookCommand, unhookCommand } = require('../src/commands/hook');
const { favoriteCommand, favoritesCommand } = require('../src/commands/favorite');
/*
 * .name() → sets the name of our CLI tool
 * This shows up when user types: tracker --help
 */
program.name('tracker');

/*
 * .description() → explains what our tool does
 * This also shows up in: tracker --help
 */
program.description('📟 A developer tool that auto-captures, categorizes and saves terminal commands per project for easy revision');

/*
 * .version() → sets the version of our CLI tool
 * packageJson.version reads "1.0.0" from package.json
 * So we never have to update version in two places
 * User can check version by typing: tracker --version
 */
program.version(packageJson.version);

// FIRST COMMAND

/*
 * .command() → defines a new CLI command
 * "hello" → this is what user types after tracker
 * So user runs: tracker hello
 */
program
  .command('hello')

  /*
   * .description() → explains what this command does
   * Shows up when user types: tracker --help
   */
  .description('A test command to check if CLI is working')

  /*
   * .action() → this function runs when user types: tracker hello
   * Whatever code you write inside here — runs when command is called
   */
  .action(() => {
    console.log('👋 Hey! tracker CLI is working perfectly!');
    console.log('🚀 Let\'s start tracking your commands!');
  });


/*
* Register the INIT command
*
* .command("init")  → user types: tracker init
* .description()    → shows in tracker --help
* .action()         → runs initCommand() when user types tracker init
*
* initCommand is imported from src/commands/init.js
* We just CALL it here — all logic lives in init.js
* This keeps bin/tracker.js clean and simple
*/
program
  .command('init')
  .description('Initialize cmd-tracker in your current project')
  .action(() => {
    initCommand();
  });

/*
* Register the SAVE command
*
* This command is special — users never type it manually
* It gets called automatically by the shell hook
*
* .argument("<command>") → accepts everything after "tracker save"
* as a single string argument
*
* Example:
* tracker save git status origin main
* → command = "git status origin main"
*
* "<command>" → angle brackets mean this argument is REQUIRED
* "[command]" → square brackets mean OPTIONAL
*/
program
  .command('save')
  .description('Save a command to tracker (called automatically by shell hook)')
  .argument('<command>', 'the terminal command to save')
  .action((command) => {
    saveCommandAction(command);
  });

/*
* Register LIST command
*
* tracker list          → shows all commands
* tracker list git      → shows only git commands
*
* [category] → square brackets = OPTIONAL argument
*/
program
  .command('list')
  .description('List all saved commands or filter by category')
  .argument('[category]', 'optional category filter (git/npm/docker/linux/node/angular/python/others)')
  .action((category) => {
    listCommand(category);
  });

/*
* Register SEARCH command
*
* tracker search "git"     → finds commands containing "git"
* tracker search "install" → finds commands containing "install"
*
* <query> → required argument
*/
program
  .command('search')
  .description('Search through all saved commands')
  .argument('<query>', 'search term to look for in saved commands')
  .action((query) => {
    searchCommand(query);
  });

/*
* STATS command
* tracker stats → shows category breakdown with percentages
*/
program
  .command('stats')
  .description('Show statistics of saved commands by category')
  .action(() => {
    statsCommand();
  });

/*
 * CLEAR command
 * tracker clear       → clears ALL commands (asks confirmation)
 * tracker clear git   → clears only git commands (asks confirmation)
 *
 * [category] → optional argument
 */
program
  .command('clear')
  .description('Clear all saved commands or a specific category')
  .argument('[category]', 'optional category to clear')
  .action((category) => {
    clearCommand(category);
  });

/*
 * EXPORT command
 * tracker export       → exports as JSON file
 * tracker export --csv → exports as CSV file
 *
 * .option() → adds an optional flag to a command
 * "--csv" → user types --csv to trigger CSV export
 */
program
  .command('export')
  .description('Export saved commands as JSON or CSV file')
  .option('--csv', 'export as CSV instead of JSON')
  .action((options) => {
    exportCommand(options);
  });

/*
* HOOK command
* tracker hook → installs shell hook for auto capture
*/
program
  .command('hook')
  .description('Enable automatic command capture via shell hook')
  .action(() => {
    hookCommand();
  });

/*
 * UNHOOK command
 * tracker unhook → removes shell hook
 */
program
  .command('unhook')
  .description('Disable automatic command capture')
  .action(() => {
    unhookCommand();
  });


/*
* FAVORITE command
* tracker favorite "git status" → toggles favorite
*/
program
  .command('favorite')
  .description('Toggle a command as favorite')
  .argument('<command>', 'command to mark as favorite')
  .action((command) => {
    favoriteCommand(command);
  });

/*
 * FAVORITES command
 * tracker favorites → lists all favorites
 */
program
  .command('favorites')
  .description('List all favorited commands')
  .action(() => {
    favoritesCommand();
  });
/*
 * This line is VERY important
 * It tells commander to start reading what the user typed
 * Without this line - nothing works
 * Always keep this at the BOTTOM of this file *
 * process.argv contains everything user typed:
 * ["node", "tracker.js", "init"] → runs init command
 * ["node", "tracker.js", "list"] → runs list command (coming soon)
 */

// Import command
program
  .command('import <filepath>')
  .description('Import commands from file and show summary')
  .action((filepath) => {
    importcommand(filepath);
  });


program.parse(process.argv);
