var CronJob = require('cron').CronJob;
var request = require('request');
var _ = require('lodash');
var fs = require('fs');

var updateTime;

var isExist = function(str) {
  try{
    var fd = fs.openSync('./data/'+str, 'r');
    fs.closeSync(fd);
    return true;
  }catch(e) {
    return false;
  }
};

var job = new CronJob('0 '+ _.range(0, 60, 1).join(',') +' * * * *', function() {
  request.get({
    url: 'http://www.gzjt.gov.cn/gztraffic/GetData.ashx',
  }, function(err, res, body) {
    var time = body.match(/Date\(([0-9]*)\)/)[1];

    if (!isExist(time)) {
      updateTime = time;

      fs.writeFile('./data/'+time, body, function(err) {
        request.post({
          url: 'https://hook.bearychat.com/=bw5Mw/incoming/2f88bb3f1a8c1b885c079856d66eb382',
          json: true,
          body: {text:(err?('write file '+time+' failed'):(time+' saved'))}
        });
      })
    }
  });

  /*
   * Runs every weekday (Monday through Friday)
   * at 11:30:00 AM. It does not run on Saturday
   * or Sunday.
   */
  }, function () {
    /* This function is executed when the job stops */
  },
  true /* Start the job right now */
);
