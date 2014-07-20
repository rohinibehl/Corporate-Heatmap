var express = require('express')
  , io = require('socket.io')
  , http = require('http')
  , twitter = require('ntwitter')
  , cronJob = require('cron').CronJob
  , _ = require('underscore')
  , path = require('path');


var app = express();

var server = http.createServer(app);

//Twitter API keys
var api_key = 'MY4hl2s8wC4QIrfs0IXn6rGu8';
var api_secret = 'WLajmJlwZxIzb4FheOY1DHl7AZyBbNLKzuRaDn6A1yKJue1k2m';
var access_token = '2652812126-IVxldr8vp1rPvrq1mm4b3eHExOMIvSDFlDQofQh';
var access_token_secret = 'ccSJPEEXOAbKQUe3lSGQCKUZR8s9hEGhKoG0Eek3idzrp';

// Twitter symbols array
var watchSymbols = ['$msft', '$intc', '$hpq', '$lnkd', '$yhoo', '$goog', '$fb', '$csco', '$aapl',  '$nvda', '$orcl', '$ntap', '$twtr', '$emc','$ibm', '$gluu', '$plug', '$sndk',

'$twx', '$nflx', '$dwa', '$dis', '$holl',
'$hmc', '$bmw', '$f', '$nsany', 
'$jcp', '$m', '$shld', '$tgt', '$wmt', '$amzn', '$aro', '$pg',		
'$nok',  '$t', '$vz', '$s', '$pcs', '$bbry',
'$bac', '$wfc', '$gs', '$mer', '$c', '$unb', '$bcs', '$db', '$pru'	,
     '$xom', '$cvx', '$ge', '$valero',
     '$ko',	'$pep', '$cmg', '$mcd', '$dpz', '$sbux', '$peet', '$cake'];

//Maintains a map of company to tweets seen for that company within various industries. Also keeps a tally of the total number of tweets seen in each industry. 
var watchList = {
    techTotal: 0,
    entertainmentTotal: 0,
    autoIndustryTotal: 0,
    retailTotal: 0,
    mobileCarriersTotal: 0,
    financialTotal:0,
    foodTotal: 0, 
   
    tech: {'$msft':0, '$intc':0, '$hpq':0, '$lnkd':0, '$yhoo':0, '$goog':0, '$fb':0, '$csco':0, '$aapl':0,  '$nvda':0, '$orcl':0, '$ntap':0, '$twtr':0, '$emc':0,'$ibm':0, '$gluu':0, '$plug':0, '$sndk':0},
    entertainment: {'$twx':0, '$nflx':0, '$dwa':0, '$dis':0, '$holl':0, '$fox':0, '$ctn':0},
    autoIndustry: {'$hmc':0, '$tm':0, '$bmw':0, '$f':0, '$nsany':0, '$gm':0, '$hog':0, '$mzday':0, '$poahf':0, '$tsla':0, '$toyof':0, '$vlkpy':0, '$yamhf':0, '$fiadf':0},
    retail: {'$jcp':0, '$m':0, '$shld':0, '$tgt':0, '$wmt':0, '$amzn':0, '$aro':0, '$pg':0, '$burl':0, '$anf':0, '$aeo':0, '$cri':0, '$coh':0, '$expr':0, '$gps':0, '$nwy':0, '$jwn':0, '$rost':0, '$urbn':0, '$zumz':0},
    mobileCarriers: {'$nok':0,  '$t':0, '$vz':0, '$s':0, '$pcs':0, '$bbry':0},
    financial: {'$bac':0, '$wfc':0, '$gs':0, '$mer':0, '$c':0, '$unb':0, '$bcs':0, '$db':0, '$pru':0},
    food: {'$ko':0, '$pep':0, '$cmg':0, '$mcd':0, '$dpz':0, '$sbux':0, '$peet':0, '$cake':0}
};

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/components', express.static(path.join(__dirname, 'components')));


if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', function(req, res) {
	res.render('index', { data: watchList });
});

//Socket.io listening on http server created above
var sockets = io.listen(server);

sockets.sockets.on('connection', function(socket) { 
    socket.emit('data', watchList);
});

//Starts the connection to twitter
var t = new twitter({
    consumer_key: api_key,
    consumer_secret: api_secret,
    access_token_key: access_token,
    access_token_secret: access_token_secret
});

//Twitter API filters feed on these watch symbols
t.stream('statuses/filter', { track: watchSymbols }, function(stream) {

//Data represents incoming tweets
  stream.on('data', function(tweet) { 

    var techClaimed = false;
    var entertainmentClaimed = false;
    var autoIndustryClaimed = false;
    var retailClaimed = false;
    var mobileCarriersClaimed = false;
    var financialClaimed = false;
    var foodClaimed = false;
 
    if (tweet.text !== undefined) {

      var text = tweet.text.toLowerCase();

      _.each(watchSymbols, function(v) {

          if (text.indexOf(v.toLowerCase()) !== -1) {
            if (v in watchList.tech) {
              watchList.tech[v]++;
              techClaimed = true;
            } else if (v in watchList.entertainment) {
              watchList.entertainment[v]++;
              entertainmentClaimed = true;
            } else if (v in watchList.autoIndustry) {
              watchList.autoIndustry[v]++;
              autoIndustryClaimed = true;
            } else if (v in watchList.retail) {
              watchList.retail[v]++;
              retailClaimed = true;
            } else if (v in watchList.mobileCarriers){
              watchList.mobileCarriers[v]++;
              mobileCarriersClaimed = true;
            } else if (v in watchList.financial) {
              watchList.financial[v]++;
              financialClaimed = true;
            } else if (v in watchList.food) {
              watchList.food[v]++;
              foodClaimed = true;
            } 
             
          }
      });

      if (techClaimed) {
          watchList.techTotal++;
      } else if (entertainmentClaimed) {
          watchList.entertainmentTotal++;
      } else if (autoIndustryClaimed){
          watchList.autoIndustryTotal++;
      } else if (retailClaimed) {
          watchList.retailTotal++;
      } else if (mobileCarriersClaimed){
        watchList.mobileCarriersTotal++;
      } else if (financialClaimed) {
        watchList.financialTotal++;
      } else if (foodClaimed) {
        watchList.foodTotal++;
      } 

      if (techClaimed || entertainmentClaimed || autoIndustryClaimed || retailClaimed || mobileCarriersClaimed || financialClaimed || foodClaimed) {
          sockets.sockets.emit('data', watchList);
      
      }  
    }
  });
});

//Cron resets the data on a new day
new cronJob('0 0 0 * * *', function(){
    watchList.techTotal = 0;
    watchList.entertainmentTotal = 0;
    watchList.autoIndustryTotal = 0;
    watchList.retailTotal = 0;
    watchList.mobileCarriersTotal = 0;
    watchList.financialTotal = 0;
    watchList.foodTotal = 0;

    for(symbol in watchList.tech) {
      watchList.tech[symbol] = 0;
    }
    for (symbol in watchList.entertainment) {
      watchList.entertainment[symbol] = 0;
    }
    for (symbol in watchList.autoIndustry) {
      watchList.autoIndustry[symbol] = 0;
    }
    for (symbol in watchList.retail) {
      watchList.retail[symbol] = 0;
    }
    for (symbol in watchList.mobileCarriers) {
      watchList.mobileCarriers[symbol] = 0;
    }

    for (symbol in watchList.financial) {
      watchList.financial[symbol] = 0;
    }

    for (symbol in watchList.food) {
      watchList.food[symbol] = 0;
    }

    sockets.sockets.emit('data', watchList);
}, null, true);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
