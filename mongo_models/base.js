const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const mongoose = require('mongoose');
const mongoConf = require('config').get('mongodb');


let base = {
  createdAt: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
};


const baseSchema = () => {
  let schema = new mongoose.Schema(base);
  schema.pre('save', function (next) {
    let now = Date.now();
    this.updatedAt = now;
    if (!this.createdAt) {
      this.createdAt = now;
    }
    next();
  });
  schema.pre('update', function (next) {
    this._update.updatedAt = Date.now();
    next();
  });
  schema.pre('updateOne', function () {
    this.set({
      updatedAt: Date.now()
    });
  });
  schema.pre('findOneAndUpdate', function (next) {
    this._update.updatedAt = Date.now();
    next();
  });
  // Comment this once model fields and validators added
  schema.set('runValidators', false);
  schema.set('strict', false);
  return schema;
};


const mongoClient = (options) => {

  console.log('Connecting to database', chalk.magenta(mongoConf.uri), '...');
  mongoose.set('debug', mongoConf.debug);
  options = options || mongoConf.config;
  mongoose.connect(mongoConf.uri, options);
  mongoose.connection.on('error', error => {
    console.log(chalk.red('Database error'));
    // process.exit(-1);
  });
  mongoose.connection.on('disconnected', error => {
    console.log(chalk.red('Database disconnected'));
  });

  console.log('Loading model files...');
  glob.sync('./mongo_models/*.js').forEach(modelPath => {
    console.log(chalk.grey(' - %s'), modelPath.replace('./mongo_models/', ''));
    require(path.resolve(modelPath));
  });

  process.on('SIGINT', function () {
    mongoose.connection.close(function () {
      console.log(chalk.green('Mongoose connection disconnected after app termination'));
      process.exit(0);
    });
  });
  return new Promise((resolve, reject) => {
    mongoose.connection.on('connected', () => {
      console.log(chalk.green('Database connected @'), chalk.magenta(mongoConf.uri));
      resolve('Connected');
    });
  });
};

module.exports = {
  baseSchema,
  mongoClient
};
