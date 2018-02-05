
var csv = require("fast-csv");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/CustomerInfo");
var fs = require('fs'),
request = require('request');
const downloader = require('images-downloader').images;
var Customer = require('../models/customer');


var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
       
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
 
var custList=[];
module.exports.customer = {
    getCustomers:function(req,res)
    {
        var users = [];
          Customer.find({}, function(err, users) {
            if (err) res.send(err);
        console.log(JSON.stringify(users));
         res.send(JSON.stringify(users));
          });
        
    },

    importCustomerData: function (csvstream) {
        csv
            .fromPath(csvstream, {headers: true})
            .on("data", function (data) {
                console.log(data);

                //Removes spaces from property value in-case it does have
                for (var key in data) {
                    data[key] = data[key].trim();
                }
                //Create a customer Object and assign all values for it to save in database
                var customer = new Customer({
                    SerialNo: data['Sr.No'],
                    Name: data['Name'],
                    email: data['email'],
                    PhoneNumber: data['Phone No'],
                    ImageLink: data['Image Link'],
                    Title: data['Title']
                });
                //save in database

                Customer.find({ email: data['email'] }, function(err, user) {
                    if (err) throw err;
                  
                    // delete him
                    Customer.findOneAndUpdate({ email: data['email'] }, { ImageLink: data['Image Link'] }, function(err, user) {
                        if (err) throw err;
                      
                        download(data['Image Link'],'./images/'+data['Name']+'_'+data['Phone No']+'.jpg', function(){
                            console.log('done downloading image');
                          });

                
                        
                      });
                        return;
                  });

                
           

                customer.save(function (err) {
                    if (err) {
                        console.log("There is an error in processing customer data: " + err);
                    } else {
                        console.log("Customer data has been saved: " + data);
                        download(data['Image Link'],'./images/'+data['Name']+'_'+data['Phone No']+'.jpg', function(){
                            console.log('done downloading image');
                          });

                    }
                })
            })
            .on("error", function (error) {
                console.log("There is an error in processing: " + error);
            })
            .on("end", function () {
                console.log("done");
            });

    }

  

}
